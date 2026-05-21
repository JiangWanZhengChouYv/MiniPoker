import { Card, Suit, Rank } from './Card';
import { Deck } from './Deck';
import { BaseHandResult, BaseGamePlayer, BaseGameState, BaseGame } from './GameBase';

export enum ZhaJinHuaHandType {
  Single = 'single',
  Pair = 'pair',
  Straight = 'straight',
  Flush = 'flush',
  FullHouse = 'fullHouse',
  FourOfAKind = 'fourOfAKind',
  StraightFlush = 'straightFlush'
}

export interface ZhaJinHuaHandResult extends BaseHandResult {
  type: ZhaJinHuaHandType;
  mainRank: Rank;
  secondRank?: Rank;
  sortedRanks: Rank[];
}

export class ZhaJinHuaHandAnalyzer {
  static analyze(cards: Card[]): ZhaJinHuaHandResult | null {
    if (cards.length !== 3) return null;

    const sortedCards = [...cards].sort((a, b) => b.compareTo(a));
    const sortedRanks = sortedCards.map(c => c.rank);
    const sortedSuits = sortedCards.map(c => c.suit);
    const rankCounts = this.getRankCounts(sortedCards);

    const straightFlush = this.checkStraightFlush(sortedCards, sortedRanks, sortedSuits);
    if (straightFlush) return straightFlush;

    const fourOfAKind = this.checkFourOfAKind(sortedCards, rankCounts);
    if (fourOfAKind) return fourOfAKind;

    const fullHouse = this.checkFullHouse(sortedCards, rankCounts);
    if (fullHouse) return fullHouse;

    const flush = this.checkFlush(sortedCards, sortedRanks, sortedSuits);
    if (flush) return flush;

    const straight = this.checkStraight(sortedCards, sortedRanks);
    if (straight) return straight;

    const pair = this.checkPair(sortedCards, rankCounts);
    if (pair) return pair;

    return this.checkSingle(sortedCards, sortedRanks);
  }

  private static getRankCounts(cards: Card[]): Map<Rank, number> {
    const counts = new Map<Rank, number>();
    for (const card of cards) {
      counts.set(card.rank, (counts.get(card.rank) || 0) + 1);
    }
    return counts;
  }

  private static checkStraightFlush(cards: Card[], ranks: Rank[], suits: Suit[]): ZhaJinHuaHandResult | null {
    const isFlush = suits.every(s => s === suits[0]);
    if (!isFlush) return null;

    const isStraight = this.isConsecutive(ranks);
    if (!isStraight) return null;

    return {
      type: ZhaJinHuaHandType.StraightFlush,
      mainRank: ranks[0],
      sortedRanks: ranks,
      cards
    };
  }

  private static checkFourOfAKind(cards: Card[], rankCounts: Map<Rank, number>): ZhaJinHuaHandResult | null {
    for (const [rank, count] of rankCounts) {
      if (count === 4) {
        const sortedCards = [...cards].sort((a, b) => b.compareTo(a));
        return {
          type: ZhaJinHuaHandType.FourOfAKind,
          mainRank: rank,
          sortedRanks: sortedCards.map(c => c.rank),
          cards
        };
      }
    }
    return null;
  }

  private static checkFullHouse(cards: Card[], rankCounts: Map<Rank, number>): ZhaJinHuaHandResult | null {
    if (cards.length !== 3) return null;
    
    let threeRank: Rank | null = null;
    let pairRank: Rank | null = null;
    
    for (const [rank, count] of rankCounts) {
      if (count === 3) {
        threeRank = rank;
      } else if (count === 2) {
        pairRank = rank;
      }
    }
    
    if (threeRank) {
      const sortedCards = [...cards].sort((a, b) => b.compareTo(a));
      return {
        type: ZhaJinHuaHandType.FullHouse,
        mainRank: threeRank,
        sortedRanks: sortedCards.map(c => c.rank),
        cards
      };
    }
    
    return null;
  }

  private static checkFlush(cards: Card[], ranks: Rank[], suits: Suit[]): ZhaJinHuaHandResult | null {
    const isFlush = suits.every(s => s === suits[0]);
    if (!isFlush) return null;

    return {
      type: ZhaJinHuaHandType.Flush,
      mainRank: ranks[0],
      sortedRanks: ranks,
      cards
    };
  }

  private static checkStraight(cards: Card[], ranks: Rank[]): ZhaJinHuaHandResult | null {
    const isStraight = this.isConsecutive(ranks);
    if (!isStraight) return null;

    return {
      type: ZhaJinHuaHandType.Straight,
      mainRank: ranks[0],
      sortedRanks: ranks,
      cards
    };
  }

  private static isConsecutive(ranks: Rank[]): boolean {
    const sorted = [...ranks].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] !== sorted[i - 1] + 1) {
        return false;
      }
    }
    return true;
  }

  private static checkPair(cards: Card[], rankCounts: Map<Rank, number>): ZhaJinHuaHandResult | null {
    let pairRank: Rank | null = null;
    let kickerRank: Rank | undefined = undefined;
    
    for (const [rank, count] of rankCounts) {
      if (count === 2) {
        pairRank = rank;
      } else {
        kickerRank = rank;
      }
    }
    
    if (pairRank) {
      const sortedCards = [...cards].sort((a, b) => b.compareTo(a));
      return {
        type: ZhaJinHuaHandType.Pair,
        mainRank: pairRank,
        secondRank: kickerRank,
        sortedRanks: sortedCards.map(c => c.rank),
        cards
      };
    }
    
    return null;
  }

  private static checkSingle(cards: Card[], ranks: Rank[]): ZhaJinHuaHandResult {
    return {
      type: ZhaJinHuaHandType.Single,
      mainRank: ranks[0],
      sortedRanks: ranks,
      cards
    };
  }

  static compare(current: ZhaJinHuaHandResult, previous: ZhaJinHuaHandResult): boolean {
    const typeRank: Record<ZhaJinHuaHandType, number> = {
      [ZhaJinHuaHandType.Single]: 0,
      [ZhaJinHuaHandType.Pair]: 1,
      [ZhaJinHuaHandType.Straight]: 2,
      [ZhaJinHuaHandType.Flush]: 3,
      [ZhaJinHuaHandType.FullHouse]: 4,
      [ZhaJinHuaHandType.FourOfAKind]: 5,
      [ZhaJinHuaHandType.StraightFlush]: 6
    };

    const currentTypeRank = typeRank[current.type];
    const previousTypeRank = typeRank[previous.type];

    if (currentTypeRank !== previousTypeRank) {
      return currentTypeRank > previousTypeRank;
    }

    if (current.mainRank !== previous.mainRank) {
      return current.mainRank > previous.mainRank;
    }

    if (current.secondRank !== undefined && previous.secondRank !== undefined) {
      if (current.secondRank !== previous.secondRank) {
        return current.secondRank > previous.secondRank;
      }
    }

    for (let i = 0; i < current.sortedRanks.length; i++) {
      if (current.sortedRanks[i] !== previous.sortedRanks[i]) {
        return current.sortedRanks[i] > previous.sortedRanks[i];
      }
    }

    return false;
  }
}

export enum ZhaJinHuaGameState {
  Waiting = 'waiting',
  Dealing = 'dealing',
  Playing = 'playing',
  Showdown = 'showdown',
  Finished = 'finished'
}

export interface ZhaJinHuaPlayer extends BaseGamePlayer {
  chips: number;
  folded: boolean;
  bet: number;
  isActive: boolean;
}

export enum ZhaJinHuaActionType {
  Fold = 'fold',
  Check = 'check',
  Call = 'call',
  Raise = 'raise'
}

export interface ZhaJinHuaAction {
  playerId: number;
  type: ZhaJinHuaActionType;
  amount?: number;
}

export class ZhaJinHuaGame implements BaseGame<ZhaJinHuaPlayer, ZhaJinHuaHandResult> {
  private deck: Deck;
  private players: ZhaJinHuaPlayer[];
  private currentPlayerId: number;
  private gameState: ZhaJinHuaGameState;
  private winnerId: number | null;
  private pot: number;
  private currentBet: number;
  private smallBlind: number;
  private bigBlind: number;
  private dealerPlayerId: number;

  constructor(playerCount: number = 3, smallBlind: number = 1, bigBlind: number = 2) {
    this.deck = new Deck(false);
    this.players = [];
    for (let i = 0; i < playerCount; i++) {
      this.players.push({
        id: i,
        cards: [],
        chips: 100,
        folded: false,
        bet: 0,
        isActive: true
      });
    }
    this.currentPlayerId = 0;
    this.gameState = ZhaJinHuaGameState.Waiting;
    this.winnerId = null;
    this.pot = 0;
    this.currentBet = 0;
    this.smallBlind = smallBlind;
    this.bigBlind = bigBlind;
    this.dealerPlayerId = 0;
  }

  startGame(): void {
    this.deck.reset();
    this.deck.shuffle();
    this.gameState = ZhaJinHuaGameState.Dealing;
    
    this.players.forEach(p => {
      p.cards = [];
      p.folded = false;
      p.bet = 0;
      p.isActive = true;
    });
    
    this.pot = 0;
    this.currentBet = 0;
    
    this.dealerPlayerId = (this.dealerPlayerId + 1) % this.players.length;
    const smallBlindId = (this.dealerPlayerId + 1) % this.players.length;
    const bigBlindId = (this.dealerPlayerId + 2) % this.players.length;
    
    this.placeBet(smallBlindId, this.smallBlind);
    this.placeBet(bigBlindId, this.bigBlind);
    this.currentBet = this.bigBlind;
    
    this.dealCards();
    this.gameState = ZhaJinHuaGameState.Playing;
    this.currentPlayerId = (bigBlindId + 1) % this.players.length;
  }

  private dealCards(): void {
    for (const player of this.players) {
      player.cards = this.deck.deal(3);
    }
  }

  private placeBet(playerId: number, amount: number): boolean {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player.folded || player.chips < amount) return false;
    
    player.chips -= amount;
    player.bet += amount;
    this.pot += amount;
    
    return true;
  }

  takeAction(action: ZhaJinHuaAction): boolean {
    if (this.gameState !== ZhaJinHuaGameState.Playing) return false;
    if (action.playerId !== this.currentPlayerId) return false;
    
    const player = this.players.find(p => p.id === action.playerId);
    if (!player || player.folded) return false;

    switch (action.type) {
      case ZhaJinHuaActionType.Fold:
        player.folded = true;
        player.isActive = false;
        break;
        
      case ZhaJinHuaActionType.Check:
        if (player.bet < this.currentBet) return false;
        break;
        
      case ZhaJinHuaActionType.Call:
        const callAmount = this.currentBet - player.bet;
        if (callAmount <= 0) return false;
        if (!this.placeBet(action.playerId, callAmount)) return false;
        break;
        
      case ZhaJinHuaActionType.Raise:
        if (!action.amount || action.amount <= this.currentBet) return false;
        const raiseAmount = action.amount - player.bet;
        if (!this.placeBet(action.playerId, raiseAmount)) return false;
        this.currentBet = action.amount;
        break;
        
      default:
        return false;
    }

    this.nextPlayer();
    this.checkRoundEnd();
    
    return true;
  }

  private nextPlayer(): void {
    do {
      this.currentPlayerId = (this.currentPlayerId + 1) % this.players.length;
    } while (this.players[this.currentPlayerId].folded);
  }

  private checkRoundEnd(): void {
    const activePlayers = this.players.filter(p => !p.folded);
    
    if (activePlayers.length === 1) {
      this.finishGame(activePlayers[0].id);
      return;
    }

    const allMatched = activePlayers.every(p => p.bet === this.currentBet);
    if (allMatched) {
      this.showdown();
    }
  }

  private showdown(): void {
    this.gameState = ZhaJinHuaGameState.Showdown;
    
    const activePlayers = this.players.filter(p => !p.folded);
    let bestHand: ZhaJinHuaHandResult | null = null;
    let bestPlayerId: number | null = null;

    for (const player of activePlayers) {
      const hand = ZhaJinHuaHandAnalyzer.analyze(player.cards);
      if (!hand) continue;

      if (!bestHand || ZhaJinHuaHandAnalyzer.compare(hand, bestHand)) {
        bestHand = hand;
        bestPlayerId = player.id;
      }
    }

    if (bestPlayerId !== null) {
      this.finishGame(bestPlayerId);
    }
  }

  private finishGame(winnerId: number): void {
    const winner = this.players.find(p => p.id === winnerId);
    if (winner) {
      winner.chips += this.pot;
    }
    
    this.winnerId = winnerId;
    this.gameState = ZhaJinHuaGameState.Finished;
  }

  getGameState(): ZhaJinHuaGameState {
    return this.gameState;
  }

  getPlayers(): ZhaJinHuaPlayer[] {
    return this.players.map(p => ({
      ...p,
      cards: [...p.cards]
    }));
  }

  getCurrentPlayerId(): number {
    return this.currentPlayerId;
  }

  getWinnerId(): number | null {
    return this.winnerId;
  }

  getPot(): number {
    return this.pot;
  }

  getCurrentBet(): number {
    return this.currentBet;
  }
}
