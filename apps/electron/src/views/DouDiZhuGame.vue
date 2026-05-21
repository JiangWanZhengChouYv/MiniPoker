<template>
  <div class="doudizhu-game">
    <div class="game-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1 class="game-title">斗地主</h1>
      <div class="game-status">
        {{ getGameStatusText }}
      </div>
    </div>

    <div class="game-table">
      <div class="player opponent left">
        <div class="player-info">
          <div class="player-name">
            <span class="player-role" :class="{ landlord: players[1]?.role === 'landlord' }">
              {{ players[1]?.role === 'landlord' ? '地主' : '农民' }}
            </span>
            <span class="player-id">玩家2</span>
          </div>
          <div class="card-count">剩余 {{ players[1]?.cards.length || 0 }} 张</div>
        </div>
        <div class="opponent-cards">
          <PlayingCard
            v-for="(_, index) in (players[1]?.cards.length || 0)"
            :key="index"
            :card="dummyCard"
            :faceDown="true"
            size="small"
            :clickable="false"
          />
        </div>
      </div>

      <div class="table-center">
        <div v-if="landlordCards.length > 0 && landlordPlayerId === null" class="landlord-cards">
          <div class="landlord-label">地主牌</div>
          <div class="cards-display">
            <PlayingCard
              v-for="(card, index) in landlordCards"
              :key="index"
              :card="card"
              :faceDown="true"
              size="small"
              :clickable="false"
            />
          </div>
        </div>

        <div v-if="landlordPlayerId !== null && landlordCards.length > 0" class="landlord-cards-revealed">
          <div class="landlord-label">地主牌</div>
          <div class="cards-display">
            <PlayingCard
              v-for="(card, index) in landlordCards"
              :key="index"
              :card="card"
              size="small"
              :clickable="false"
            />
          </div>
        </div>

        <div class="played-cards" v-if="lastPlay">
          <div class="played-cards-player">
            {{ getPlayerName(lastPlayerId) }} 出牌
          </div>
          <div class="cards-display">
            <PlayingCard
              v-for="(card, index) in lastPlay.cards"
              :key="index"
              :card="card"
              size="medium"
              :clickable="false"
            />
          </div>
        </div>

        <div class="bidding-section" v-if="gameState === 'bidding' && isLocalPlayerTurn">
          <div class="bidding-label">是否叫地主？</div>
          <div class="bidding-buttons">
            <button class="btn btn-pass" @click="bid(0)">不叫</button>
            <button class="btn btn-bid" :disabled="highestBid >= 1" @click="bid(1)">1分</button>
            <button class="btn btn-bid" :disabled="highestBid >= 2" @click="bid(2)">2分</button>
            <button class="btn btn-bid btn-big" @click="bid(3)">3分</button>
          </div>
        </div>

        <div class="current-turn" v-if="gameState === 'playing'">
          {{ getPlayerName(currentPlayerId) }} 的回合
        </div>

        <div class="game-result" v-if="gameState === 'finished'">
          {{ getGameResultText }}
        </div>

        <div class="restart-section" v-if="gameState === 'finished'">
          <button class="btn btn-start" @click="restartGame">再来一局</button>
        </div>
      </div>

      <div class="player opponent right">
        <div class="player-info">
          <div class="player-name">
            <span class="player-role" :class="{ landlord: players[2]?.role === 'landlord' }">
              {{ players[2]?.role === 'landlord' ? '地主' : '农民' }}
            </span>
            <span class="player-id">玩家3</span>
          </div>
          <div class="card-count">剩余 {{ players[2]?.cards.length || 0 }} 张</div>
        </div>
        <div class="opponent-cards">
          <PlayingCard
            v-for="(_, index) in (players[2]?.cards.length || 0)"
            :key="index"
            :card="dummyCard"
            :faceDown="true"
            size="small"
            :clickable="false"
          />
        </div>
      </div>
    </div>

    <div class="local-player">
      <div class="player-info-bottom">
        <div class="player-name">
          <span class="player-role" :class="{ landlord: localPlayer?.role === 'landlord' }">
            {{ localPlayer?.role === 'landlord' ? '地主' : '农民' }}
          </span>
          <span class="player-id">玩家1 (你)</span>
        </div>
      </div>
      <div class="hand-cards">
        <PlayingCard
          v-for="card in sortedLocalCards"
          :key="card.toString()"
          :card="card"
          :selected="isCardSelected(card)"
          :class="{ 'current-turn': isLocalPlayerTurn && gameState === 'playing' }"
          @click="handleCardClick(card)"
        />
      </div>
    </div>

    <div class="action-buttons" v-if="gameState === 'playing'">
      <button class="btn btn-play" :disabled="!isLocalPlayerTurn || selectedCards.length === 0" @click="handlePlay">
        出牌
      </button>
      <button class="btn btn-pass" :disabled="!isLocalPlayerTurn || !canPass" @click="handlePass">
        不出
      </button>
      <button class="btn btn-hint" :disabled="!isLocalPlayerTurn" @click="handleHint">
        提示
      </button>
    </div>

    <div class="start-section" v-if="gameState === 'waiting'">
      <button class="btn btn-start" @click="startGame">开始游戏</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useGameStore, GameType } from '../stores/game';
import PlayingCard from '../components/PlayingCard.vue';
import { Card, Suit, Rank, GameState as CoreGameState, HandResult } from '@mini-poker/game-core';

const gameStore = useGameStore();

const {
  players,
  landlordCards,
  currentPlayerId,
  landlordPlayerId,
  highestBid,
  lastPlay,
  gameState,
  localPlayer,
  isLocalPlayerTurn,
  selectedCards,
  winnerId
} = gameStore;

const dummyCard = new Card(Suit.Spades, Rank.Three);
const storedCardCounts = ref<Record<number, number>>({});

watch(players, (newPlayers) => {
  newPlayers.forEach(p => {
    storedCardCounts.value[p.id] = p.cards.length;
  });
}, { deep: true });

const sortedLocalCards = computed(() => {
  if (!localPlayer.value?.cards) return [];
  return [...localPlayer.value.cards].sort((a, b) => b.compareTo(a));
});

const lastPlayerId = computed(() => {
  if (!lastPlay.value) return null;
  for (const player of players.value) {
    const prevCount = storedCardCounts.value[player.id] || player.cards.length + lastPlay.value!.cards.length;
    if (prevCount - player.cards.length === lastPlay.value!.cards.length) {
      return player.id;
    }
  }
  return null;
});

const canPass = computed(() => {
  return lastPlay.value !== null;
});

function isCardSelected(card: Card) {
  return selectedCards.some(c => c.equals(card));
}

function handleCardClick(card: Card) {
  if (gameState.value === 'playing' && isLocalPlayerTurn.value) {
    gameStore.toggleCardSelection(card);
  }
}

function handlePlay() {
  const success = gameStore.play();
  if (!success) {
    alert('出牌无效，请重新选择牌！');
  }
}

function handlePass() {
  const success = gameStore.pass();
  if (!success) {
    alert('不能不出！');
  }
}

function handleHint() {
  alert('提示功能开发中...');
}

function bid(amount: number) {
  gameStore.bid(amount);
}

function startGame() {
  players.value.forEach(p => {
    storedCardCounts.value[p.id] = 17;
  });
  gameStore.startDouDiZhuGame();
}

function restartGame() {
  gameStore.resetGame();
  gameStore.selectGameType(GameType.DouDiZhu);
}

function goBack() {
  gameStore.resetGame();
}

function getPlayerName(id: number | null) {
  if (id === null) return '';
  const names = ['玩家1 (你)', '玩家2', '玩家3'];
  return names[id] || '';
}

const getGameStatusText = computed(() => {
  const statusMap: Record<string, string> = {
    [CoreGameState.Waiting]: '等待开始',
    [CoreGameState.Dealing]: '发牌中',
    [CoreGameState.Bidding]: '叫地主',
    [CoreGameState.Playing]: '出牌中',
    [CoreGameState.Finished]: '游戏结束'
  };
  return statusMap[gameState.value] || '';
});

const getGameResultText = computed(() => {
  if (winnerId.value === null) return '';
  const isWin = winnerId.value === 0 || 
    (winnerId.value !== landlordPlayerId.value && localPlayer.value?.role !== 'landlord');
  return isWin ? '恭喜你赢了！' : '很遗憾，你输了';
});
</script>

<style scoped>
.doudizhu-game {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1a472a 100%);
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin-bottom: 1rem;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.game-title {
  color: white;
  font-size: 1.5rem;
  margin: 0;
}

.game-status {
  color: #ffd700;
  font-size: 1.1rem;
}

.game-table {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

.player {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player.opponent.left {
  align-items: flex-start;
}

.player.opponent.right {
  align-items: flex-end;
}

.player-info {
  background: rgba(0, 0, 0, 0.4);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  text-align: center;
}

.player-name {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.player-role {
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  background: rgba(255, 215, 0, 0.3);
  color: #ffd700;
}

.player-role.landlord {
  background: rgba(233, 69, 96, 0.3);
  color: #e94560;
}

.player-id {
  color: white;
  font-size: 1rem;
}

.card-count {
  color: #b0b0b0;
  font-size: 0.9rem;
}

.opponent-cards {
  display: flex;
  gap: -1.5rem;
}

.opponent-cards .playing-card {
  margin-left: -2.5rem;
}

.opponent-cards .playing-card:first-child {
  margin-left: 0;
}

.table-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.landlord-cards,
.landlord-cards-revealed {
  text-align: center;
}

.landlord-label {
  color: #ffd700;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.cards-display {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.played-cards {
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 16px;
}

.played-cards-player {
  color: white;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.bidding-section {
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem 2rem;
  border-radius: 16px;
}

.bidding-label {
  color: white;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.bidding-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.current-turn,
.game-result {
  color: white;
  font-size: 1.25rem;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
}

.local-player {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem 2rem;
  border-radius: 16px;
  margin-top: 1rem;
}

.player-info-bottom {
  text-align: center;
  margin-bottom: 1rem;
}

.hand-cards {
  display: flex;
  justify-content: center;
  gap: -1.5rem;
}

.hand-cards .playing-card {
  margin-left: -2.5rem;
}

.hand-cards .playing-card:first-child {
  margin-left: 0;
}

.hand-cards .playing-card.current-turn:hover {
  transform: translateY(-10px);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
}

.start-section,
.restart-section {
  display: flex;
  justify-content: center;
  padding: 1.5rem;
}

.btn {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: bold;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-play {
  background: linear-gradient(135deg, #42b883, #33a06f);
  color: white;
}

.btn-pass {
  background: linear-gradient(135deg, #6c757d, #5a6268);
  color: white;
}

.btn-hint {
  background: linear-gradient(135deg, #ffc107, #e0a800);
  color: #212529;
}

.btn-bid {
  background: linear-gradient(135deg, #42b883, #33a06f);
  color: white;
}

.btn-big {
  background: linear-gradient(135deg, #e94560, #d62f49);
  color: white;
}

.btn-start {
  background: linear-gradient(135deg, #42b883, #33a06f);
  color: white;
  font-size: 1.5rem;
  padding: 1rem 3rem;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
