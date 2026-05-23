import { Card, Player, Rank } from '../../types';
import { CardUtil } from '../../card';

export enum ZhaJinHuaHandType {
  SINGLE = 1,
  PAIR = 2,
  STRAIGHT = 3,
  FLUSH = 4,
  FULL_HOUSE = 5,
  FOUR_OF_A_KIND = 6,
  STRAIGHT_FLUSH = 7
}

export interface ZhaJinHuaHandResult {
  type: ZhaJinHuaHandType;
  mainRank: number;
  secondRank?: number;
  kickerRanks?: number[];
  isValid: boolean;
}

export class ZhaJinHuaGame {
  private deck: Card[];
  private players: Player[];
  private currentPlayerId: string | null = null;
  private pot: number = 0;
  private currentBet: number = 0;
  private gameStarted: boolean = false;
  private foldedPlayers: Set<string> = new Set();
  private playerBets: Map<string, number> = new Map();

  constructor(playerNames: string[]) {
    if (playerNames.length < 2 || playerNames.length > 6) {
      throw new Error('ZhaJinHua requires 2-6 players');
    }

    this.players = playerNames.map((name, index) => ({
      id: `player_${index}`,
      name,
      cards: [],
      isAI: false
    }));

    for (const player of this.players) {
      this.playerBets.set(player.id, 0);
    }

    this.deck = CardUtil.createStandardDeck(false);
  }

  startGame(initialBet: number = 1): void {
    this.deck = CardUtil.createStandardDeck(false);
    this.shuffleDeck();
    this.pot = 0;
    this.currentBet = initialBet;
    this.foldedPlayers.clear();
    
    for (const player of this.players) {
      player.cards = [];
      this.playerBets.set(player.id, 0);
    }

    for (let i = 0; i < 3; i++) {
      for (const player of this.players) {
        player.cards.push(this.deck.pop()!);
      }
    }

    this.currentPlayerId = this.players[0].id;
    this.gameStarted = true;
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  getPlayers(): Player[] {
    return [...this.players];
  }

  getPlayer(playerId: string): Player | undefined {
    return this.players.find(p => p.id === playerId);
  }

  getCurrentPlayerId(): string | null {
    return this.currentPlayerId;
  }

  getPot(): number {
    return this.pot;
  }

  getCurrentBet(): number {
    return this.currentBet;
  }

  getFoldedPlayers(): Set<string> {
    return new Set(this.foldedPlayers);
  }

  getPlayerBet(playerId: string): number {
    return this.playerBets.get(playerId) || 0;
  }

  isGameStarted(): boolean {
    return this.gameStarted;
  }

  static checkHand(cards: Card[]): ZhaJinHuaHandResult {
    if (cards.length !== 3) {
      return { type: ZhaJinHuaHandType.SINGLE, mainRank: 0, isValid: false };
    }

    const sortedCards = CardUtil.sortCards(cards, false);
    const ranks = sortedCards.map(c => c.rank);
    const suits = sortedCards.map(c => c.suit);

    const isFlush = suits[0] === suits[1] && suits[1] === suits[2];
    const isStraight = (ranks[0] - ranks[1] === 1 && ranks[1] - ranks[2] === 1) ||
                       (ranks[0] === Rank.ACE && ranks[1] === Rank.THREE && ranks[2] === Rank.TWO);

    if (isFlush && isStraight) {
      return {
        type: ZhaJinHuaHandType.STRAIGHT_FLUSH,
        mainRank: ranks[0] === Rank.ACE && ranks[1] === Rank.THREE ? Rank.THREE : ranks[0],
        isValid: true
      };
    }

    if (ranks[0] === ranks[1] && ranks[1] === ranks[2]) {
      return {
        type: ZhaJinHuaHandType.FOUR_OF_A_KIND,
        mainRank: ranks[0],
        isValid: true
      };
    }

    if (isFlush) {
      return {
        type: ZhaJinHuaHandType.FLUSH,
        mainRank: ranks[0],
        secondRank: ranks[1],
        kickerRanks: [ranks[2]],
        isValid: true
      };
    }

    if (isStraight) {
      return {
        type: ZhaJinHuaHandType.STRAIGHT,
        mainRank: ranks[0] === 14 && ranks[1] === 3 ? 3 : ranks[0],
        isValid: true
      };
    }

    if (ranks[0] === ranks[1]) {
      return {
        type: ZhaJinHuaHandType.PAIR,
        mainRank: ranks[0],
        kickerRanks: [ranks[2]],
        isValid: true
      };
    }

    if (ranks[1] === ranks[2]) {
      return {
        type: ZhaJinHuaHandType.PAIR,
        mainRank: ranks[1],
        kickerRanks: [ranks[0]],
        isValid: true
      };
    }

    return {
      type: ZhaJinHuaHandType.SINGLE,
      mainRank: ranks[0],
      secondRank: ranks[1],
      kickerRanks: [ranks[2]],
      isValid: true
    };
  }

  static compareHands(hand1: ZhaJinHuaHandResult, hand2: ZhaJinHuaHandResult): number {
    if (hand1.type !== hand2.type) {
      return hand1.type - hand2.type;
    }

    if (hand1.mainRank !== hand2.mainRank) {
      return hand1.mainRank - hand2.mainRank;
    }

    if (hand1.secondRank !== hand2.secondRank) {
      return (hand1.secondRank || 0) - (hand2.secondRank || 0);
    }

    if (hand1.kickerRanks && hand2.kickerRanks) {
      for (let i = 0; i < hand1.kickerRanks.length; i++) {
        if (hand1.kickerRanks[i] !== hand2.kickerRanks[i]) {
          return hand1.kickerRanks[i] - hand2.kickerRanks[i];
        }
      }
    }

    return 0;
  }

  bet(playerId: string, amount: number): boolean {
    if (!this.gameStarted) {
      return false;
    }

    if (this.currentPlayerId !== playerId) {
      return false;
    }

    if (this.foldedPlayers.has(playerId)) {
      return false;
    }

    if (amount < this.currentBet) {
      return false;
    }

    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      return false;
    }

    const currentPlayerBet = this.playerBets.get(playerId) || 0;
    const additionalBet = amount - currentPlayerBet;

    this.pot += additionalBet;
    this.playerBets.set(playerId, amount);
    this.currentBet = amount;

    this.nextPlayer();
    return true;
  }

  call(playerId: string): boolean {
    return this.bet(playerId, this.currentBet);
  }

  raise(playerId: string, amount: number): boolean {
    return this.bet(playerId, this.currentBet + amount);
  }

  fold(playerId: string): boolean {
    if (!this.gameStarted) {
      return false;
    }

    if (this.currentPlayerId !== playerId) {
      return false;
    }

    if (this.foldedPlayers.has(playerId)) {
      return false;
    }

    this.foldedPlayers.add(playerId);

    if (this.foldedPlayers.size >= this.players.length - 1) {
      this.gameStarted = false;
    } else {
      this.nextPlayer();
    }

    return true;
  }

  showdown(): Player | null {
    if (this.foldedPlayers.size >= this.players.length - 1) {
      const winner = this.players.find(p => !this.foldedPlayers.has(p.id));
      this.gameStarted = false;
      return winner || null;
    }

    const activePlayers = this.players.filter(p => !this.foldedPlayers.has(p.id));
    if (activePlayers.length < 2) {
      return null;
    }

    let winner: Player = activePlayers[0];
    let bestHand = ZhaJinHuaGame.checkHand(winner.cards);

    for (let i = 1; i < activePlayers.length; i++) {
      const currentHand = ZhaJinHuaGame.checkHand(activePlayers[i].cards);
      if (ZhaJinHuaGame.compareHands(currentHand, bestHand) > 0) {
        bestHand = currentHand;
        winner = activePlayers[i];
      }
    }

    this.gameStarted = false;
    return winner;
  }

  private nextPlayer(): void {
    let currentIndex = this.players.findIndex(p => p.id === this.currentPlayerId);
    let nextIndex = (currentIndex + 1) % this.players.length;

    while (this.foldedPlayers.has(this.players[nextIndex].id)) {
      nextIndex = (nextIndex + 1) % this.players.length;
    }

    this.currentPlayerId = this.players[nextIndex].id;
  }
}
