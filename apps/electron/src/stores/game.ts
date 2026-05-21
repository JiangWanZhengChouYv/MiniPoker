import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { DouDiZhuGame, Card, GameState, PlayerRole, DouDiZhuHandAnalyzer, HandResult } from '@mini-poker/game-core';

export enum GameType {
  None = 'none',
  DouDiZhu = 'doudizhu',
  GuanDan = 'guandan',
  ZhaJinHua = 'zhajinhua',
  Multiplayer = 'multiplayer'
}

let aiTimer: any = null;

export const useGameStore = defineStore('game', () => {
  const currentGameType = ref<GameType>(GameType.None);
  const douDiZhuGame = ref<DouDiZhuGame | null>(null);
  const selectedCards = ref<Card[]>([]);
  const localPlayerId = ref(0);

  const isGameActive = computed(() => currentGameType.value !== GameType.None);
  const gameState = computed(() => douDiZhuGame.value?.getGameState() || GameState.Waiting);
  const players = computed(() => douDiZhuGame.value?.getPlayers() || []);
  const landlordCards = computed(() => douDiZhuGame.value?.getLandlordCards() || []);
  const currentPlayerId = computed(() => douDiZhuGame.value?.getCurrentPlayerId() || 0);
  const landlordPlayerId = computed(() => douDiZhuGame.value?.getLandlordPlayerId() || null);
  const highestBid = computed(() => douDiZhuGame.value?.getHighestBid() || 0);
  const lastPlay = computed<HandResult | null>(() => douDiZhuGame.value?.getLastPlay() || null);
  const winnerId = computed(() => douDiZhuGame.value?.getWinnerId() || null);
  const localPlayer = computed(() => players.value.find(p => p.id === localPlayerId.value));
  const isLocalPlayerTurn = computed(() => currentPlayerId.value === localPlayerId.value);

  watch([currentPlayerId, gameState], () => {
    if (douDiZhuGame.value && !isLocalPlayerTurn.value && gameState.value !== GameState.Finished && gameState.value !== GameState.Waiting) {
      if (aiTimer) clearTimeout(aiTimer);
      aiTimer = setTimeout(() => {
        aiTurn();
      }, 800);
    }
  });

  function selectGameType(type: GameType) {
    currentGameType.value = type;
    if (type === GameType.DouDiZhu) {
      douDiZhuGame.value = new DouDiZhuGame();
    }
  }

  function startDouDiZhuGame() {
    if (douDiZhuGame.value) {
      douDiZhuGame.value.startGame();
      selectedCards.value = [];
    }
  }

  function toggleCardSelection(card: Card) {
    const index = selectedCards.value.findIndex(c => c.equals(card));
    if (index === -1) {
      selectedCards.value.push(card);
    } else {
      selectedCards.value.splice(index, 1);
    }
  }

  function clearSelectedCards() {
    selectedCards.value = [];
  }

  function bid(amount: number) {
    if (douDiZhuGame.value) {
      douDiZhuGame.value.bid(currentPlayerId.value, amount);
    }
  }

  function play() {
    if (douDiZhuGame.value && isLocalPlayerTurn.value && selectedCards.value.length > 0) {
      const success = douDiZhuGame.value.play(localPlayerId.value, [...selectedCards.value]);
      if (success) {
        selectedCards.value = [];
      }
      return success;
    }
    return false;
  }

  function pass() {
    if (douDiZhuGame.value) {
      return douDiZhuGame.value.pass(currentPlayerId.value);
    }
    return false;
  }

  function resetGame() {
    if (aiTimer) clearTimeout(aiTimer);
    currentGameType.value = GameType.None;
    douDiZhuGame.value = null;
    selectedCards.value = [];
  }

  function aiTurn() {
    if (!douDiZhuGame.value) return;
    
    const state = gameState.value;
    const playerId = currentPlayerId.value;
    
    if (state === GameState.Bidding) {
      aiBid(playerId);
    } else if (state === GameState.Playing) {
      aiPlay(playerId);
    }
  }

  function aiBid(playerId: number) {
    if (!douDiZhuGame.value) return;
    
    const player = players.value.find(p => p.id === playerId);
    if (!player) return;
    
    const currentBid = highestBid.value;
    let bidAmount = 0;
    
    const bigCards = player.cards.filter(c => c.rank >= 12).length;
    const hasJokers = player.cards.filter(c => c.isJoker()).length;
    
    if (hasJokers >= 2 || (hasJokers >= 1 && bigCards >= 5)) {
      if (currentBid < 3) {
        bidAmount = 3;
      }
    } else if (bigCards >= 4) {
      if (currentBid < 2) {
        bidAmount = 2;
      }
    } else if (bigCards >= 2 && Math.random() > 0.5) {
      if (currentBid < 1) {
        bidAmount = 1;
      }
    }
    
    bid(bidAmount);
  }

  function aiPlay(playerId: number) {
    if (!douDiZhuGame.value) return;
    
    const player = players.value.find(p => p.id === playerId);
    if (!player) return;
    
    const cardsToPlay = findCardsToPlay(player.cards);
    
    if (cardsToPlay.length > 0) {
      douDiZhuGame.value.play(playerId, cardsToPlay);
    } else if (lastPlay.value) {
      pass();
    }
  }

  function findCardsToPlay(hand: Card[]): Card[] {
    if (!douDiZhuGame.value) return [];
    
    const last = lastPlay.value;
    
    const sortedHand = [...hand].sort((a, b) => a.compareTo(b));
    
    if (!last) {
      return [sortedHand[0]];
    }
    
    for (const card of sortedHand) {
      const play = [card];
      const result = DouDiZhuHandAnalyzer.analyze(play);
      if (result && DouDiZhuHandAnalyzer.compare(result, last)) {
        return play;
      }
    }
    
    for (let i = 0; i < sortedHand.length - 1; i++) {
      if (sortedHand[i].rank === sortedHand[i + 1].rank) {
        const play = [sortedHand[i], sortedHand[i + 1]];
        const result = DouDiZhuHandAnalyzer.analyze(play);
        if (result && DouDiZhuHandAnalyzer.compare(result, last)) {
          return play;
        }
      }
    }
    
    for (let i = 0; i < sortedHand.length - 2; i++) {
      if (sortedHand[i].rank === sortedHand[i + 1].rank && sortedHand[i].rank === sortedHand[i + 2].rank) {
        const play = [sortedHand[i], sortedHand[i + 1], sortedHand[i + 2]];
        const result = DouDiZhuHandAnalyzer.analyze(play);
        if (result && DouDiZhuHandAnalyzer.compare(result, last)) {
          return play;
        }
      }
    }
    
    for (let i = 0; i < sortedHand.length - 3; i++) {
      if (sortedHand[i].rank === sortedHand[i + 1].rank && 
          sortedHand[i].rank === sortedHand[i + 2].rank && 
          sortedHand[i].rank === sortedHand[i + 3].rank) {
        const play = [sortedHand[i], sortedHand[i + 1], sortedHand[i + 2], sortedHand[i + 3]];
        const result = DouDiZhuHandAnalyzer.analyze(play);
        if (result && DouDiZhuHandAnalyzer.compare(result, last)) {
          return play;
        }
      }
    }
    
    return [];
  }

  return {
    currentGameType,
    douDiZhuGame,
    selectedCards,
    localPlayerId,
    isGameActive,
    gameState,
    players,
    landlordCards,
    currentPlayerId,
    landlordPlayerId,
    highestBid,
    lastPlay,
    winnerId,
    localPlayer,
    isLocalPlayerTurn,
    selectGameType,
    startDouDiZhuGame,
    toggleCardSelection,
    clearSelectedCards,
    bid,
    play,
    pass,
    resetGame
  };
});
