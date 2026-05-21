import { Card, Rank } from './Card';
import { Deck } from './Deck';

export enum HandType {
  Single = 'single',
  Pair = 'pair',
  Triple = 'triple',
  TripleWithOne = 'tripleWithOne',
  TripleWithTwo = 'tripleWithTwo',
  Straight = 'straight',
  DoubleStraight = 'doubleStraight',
  Airplane = 'airplane',
  QuadrupleWithTwo = 'quadrupleWithTwo',
  Bomb = 'bomb',
  Rocket = 'rocket'
}

export interface HandResult {
  type: HandType;
  mainRank: Rank;
  length: number;
  cards: Card[];
}

export class DouDiZhuHandAnalyzer {
  static analyze(cards: Card[]): HandResult | null {
    if (cards.length === 0) return null;

    const sortedCards = [...cards].sort((a, b) => a.compareTo(b));
    const rankCounts = this.getRankCounts(sortedCards);

    const rocket = this.checkRocket(sortedCards);
    if (rocket) return rocket;

    const bomb = this.checkBomb(sortedCards, rankCounts);
    if (bomb) return bomb;

    const quadrupleWithTwo = this.checkQuadrupleWithTwo(sortedCards, rankCounts);
    if (quadrupleWithTwo) return quadrupleWithTwo;

    const airplane = this.checkAirplane(sortedCards, rankCounts);
    if (airplane) return airplane;

    const doubleStraight = this.checkDoubleStraight(sortedCards, rankCounts);
    if (doubleStraight) return doubleStraight;

    const straight = this.checkStraight(sortedCards, rankCounts);
    if (straight) return straight;

    const tripleWithTwo = this.checkTripleWithTwo(sortedCards, rankCounts);
    if (tripleWithTwo) return tripleWithTwo;

    const tripleWithOne = this.checkTripleWithOne(sortedCards, rankCounts);
    if (tripleWithOne) return tripleWithOne;

    const triple = this.checkTriple(sortedCards, rankCounts);
    if (triple) return triple;

    const pair = this.checkPair(sortedCards, rankCounts);
    if (pair) return pair;

    const single = this.checkSingle(sortedCards);
    if (single) return single;

    return null;
  }

  private static getRankCounts(cards: Card[]): Map<Rank, number> {
    const counts = new Map<Rank, number>();
    for (const card of cards) {
      if (!card.isJoker()) {
        counts.set(card.rank, (counts.get(card.rank) || 0) + 1);
      }
    }
    return counts;
  }

  private static checkRocket(cards: Card[]): HandResult | null {
    if (cards.length !== 2) return null;
    const hasBigJoker = cards.some(c => c.isBigJoker());
    const hasSmallJoker = cards.some(c => c.isSmallJoker());
    if (hasBigJoker && hasSmallJoker) {
      return { type: HandType.Rocket, mainRank: Rank.BigJoker, length: 2, cards };
    }
    return null;
  }

  private static checkBomb(cards: Card[], rankCounts: Map<Rank, number>): HandResult | null {
    if (cards.length !== 4) return null;
    for (const [rank, count] of rankCounts) {
      if (count === 4) {
        return { type: HandType.Bomb, mainRank: rank, length: 4, cards };
      }
    }
    return null;
  }

  private static checkQuadrupleWithTwo(cards: Card[], rankCounts: Map<Rank, number>): HandResult | null {
    if (cards.length !== 6 && cards.length !== 8) return null;
    
    let quadrupleRank: Rank | null = null;
    const otherCounts: number[] = [];
    
    for (const [rank, count] of rankCounts) {
      if (count === 4) {
        quadrupleRank = rank;
      } else {
        otherCounts.push(count);
      }
    }
    
    if (!quadrupleRank) return null;
    
    const expectedCount = cards.length === 6 ? 1 : 2;
    const expectedPairs = cards.length === 6 ? 2 : 2;
    
    if (otherCounts.length === expectedPairs && otherCounts.every(c => c === expectedCount)) {
      return { type: HandType.QuadrupleWithTwo, mainRank: quadrupleRank, length: cards.length, cards };
    }
    
    return null;
  }

  private static checkAirplane(cards: Card[], rankCounts: Map<Rank, number>): HandResult | null {
    const triples: Rank[] = [];
    const singles: Rank[] = [];
    const pairs: Rank[] = [];
    
    for (const [rank, count] of rankCounts) {
      if (count === 3) {
        triples.push(rank);
      } else if (count === 2) {
        pairs.push(rank);
      } else if (count === 1) {
        singles.push(rank);
      }
    }
    
    if (triples.length < 2) return null;
    
    triples.sort((a, b) => a - b);
    
    let isConsecutive = true;
    for (let i = 1; i < triples.length; i++) {
      if (triples[i] !== triples[i - 1] + 1) {
        isConsecutive = false;
        break;
      }
    }
    
    if (!isConsecutive) return null;
    
    const totalLength = 3 * triples.length + singles.length + 2 * pairs.length;
    if (totalLength !== cards.length) return null;
    
    if (singles.length === triples.length && pairs.length === 0) {
      return { type: HandType.Airplane, mainRank: triples[0], length: cards.length, cards };
    }
    
    if (pairs.length === triples.length && singles.length === 0) {
      return { type: HandType.Airplane, mainRank: triples[0], length: cards.length, cards };
    }
    
    if (singles.length === 0 && pairs.length === 0) {
      return { type: HandType.Airplane, mainRank: triples[0], length: cards.length, cards };
    }
    
    return null;
  }

  private static checkDoubleStraight(cards: Card[], rankCounts: Map<Rank, number>): HandResult | null {
    if (cards.length < 6 || cards.length % 2 !== 0) return null;
    
    const pairs: Rank[] = [];
    for (const [rank, count] of rankCounts) {
      if (count === 2) {
        pairs.push(rank);
      } else {
        return null;
      }
    }
    
    if (pairs.length < 3) return null;
    
    pairs.sort((a, b) => a - b);
    
    if (pairs.some(r => r >= Rank.Two)) return null;
    
    for (let i = 1; i < pairs.length; i++) {
      if (pairs[i] !== pairs[i - 1] + 1) {
        return null;
      }
    }
    
    return { type: HandType.DoubleStraight, mainRank: pairs[0], length: pairs.length, cards };
  }

  private static checkStraight(cards: Card[], rankCounts: Map<Rank, number>): HandResult | null {
    if (cards.length < 5) return null;
    
    for (const [, count] of rankCounts) {
      if (count !== 1) return null;
    }
    
    const ranks = Array.from(rankCounts.keys()).sort((a, b) => a - b);
    
    if (ranks.some(r => r >= Rank.Two)) return null;
    
    for (let i = 1; i < ranks.length; i++) {
      if (ranks[i] !== ranks[i - 1] + 1) {
        return null;
      }
    }
    
    return { type: HandType.Straight, mainRank: ranks[0], length: ranks.length, cards };
  }

  private static checkTripleWithTwo(cards: Card[], rankCounts: Map<Rank, number>): HandResult | null {
    if (cards.length !== 5) return null;
    
    let tripleRank: Rank | null = null;
    let hasPair = false;
    
    for (const [rank, count] of rankCounts) {
      if (count === 3) {
        tripleRank = rank;
      } else if (count === 2) {
        hasPair = true;
      } else {
        return null;
      }
    }
    
    if (tripleRank && hasPair) {
      return { type: HandType.TripleWithTwo, mainRank: tripleRank, length: 5, cards };
    }
    
    return null;
  }

  private static checkTripleWithOne(cards: Card[], rankCounts: Map<Rank, number>): HandResult | null {
    if (cards.length !== 4) return null;
    
    let tripleRank: Rank | null = null;
    let hasSingle = false;
    
    for (const [rank, count] of rankCounts) {
      if (count === 3) {
        tripleRank = rank;
      } else if (count === 1) {
        hasSingle = true;
      } else {
        return null;
      }
    }
    
    if (tripleRank && hasSingle) {
      return { type: HandType.TripleWithOne, mainRank: tripleRank, length: 4, cards };
    }
    
    return null;
  }

  private static checkTriple(cards: Card[], rankCounts: Map<Rank, number>): HandResult | null {
    if (cards.length !== 3) return null;
    
    for (const [rank, count] of rankCounts) {
      if (count === 3) {
        return { type: HandType.Triple, mainRank: rank, length: 3, cards };
      }
    }
    
    return null;
  }

  private static checkPair(cards: Card[], rankCounts: Map<Rank, number>): HandResult | null {
    if (cards.length !== 2) return null;
    
    for (const [rank, count] of rankCounts) {
      if (count === 2) {
        return { type: HandType.Pair, mainRank: rank, length: 2, cards };
      }
    }
    
    return null;
  }

  private static checkSingle(cards: Card[]): HandResult | null {
    if (cards.length !== 1) return null;
    return { type: HandType.Single, mainRank: cards[0].rank, length: 1, cards };
  }

  static compare(current: HandResult, previous: HandResult): boolean {
    if (previous.type === HandType.Rocket) {
      return false;
    }
    
    if (current.type === HandType.Rocket) {
      return true;
    }
    
    if (previous.type === HandType.Bomb) {
      if (current.type === HandType.Bomb) {
        return current.mainRank > previous.mainRank;
      }
      return false;
    }
    
    if (current.type === HandType.Bomb) {
      return true;
    }
    
    if (current.type !== previous.type) {
      return false;
    }
    
    if (current.length !== previous.length) {
      return false;
    }
    
    return current.mainRank > previous.mainRank;
  }
}

export enum GameState {
  Waiting = 'waiting',
  Dealing = 'dealing',
  Bidding = 'bidding',
  Playing = 'playing',
  Finished = 'finished'
}

export enum PlayerRole {
  Farmer = 'farmer',
  Landlord = 'landlord'
}

export interface Player {
  id: number;
  cards: Card[];
  role: PlayerRole;
}

export interface BidAction {
  playerId: number;
  bid: number;
}

export interface PlayAction {
  playerId: number;
  cards: Card[];
}

export class DouDiZhuGame {
  private deck: Deck;
  private players: Player[];
  private landlordCards: Card[];
  private currentPlayerId: number;
  private landlordPlayerId: number | null;
  private highestBid: number;
  private highestBidderId: number | null;
  private passCount: number;
  private lastPlay: HandResult | null;
  private lastPlayerId: number | null;
  private gameState: GameState;
  private winnerId: number | null;

  constructor() {
    this.deck = new Deck(true);
    this.players = [
      { id: 0, cards: [], role: PlayerRole.Farmer },
      { id: 1, cards: [], role: PlayerRole.Farmer },
      { id: 2, cards: [], role: PlayerRole.Farmer }
    ];
    this.landlordCards = [];
    this.currentPlayerId = 0;
    this.landlordPlayerId = null;
    this.highestBid = 0;
    this.highestBidderId = null;
    this.passCount = 0;
    this.lastPlay = null;
    this.lastPlayerId = null;
    this.gameState = GameState.Waiting;
    this.winnerId = null;
  }

  startGame(): void {
    this.deck.shuffle();
    this.gameState = GameState.Dealing;
    this.dealCards();
    this.gameState = GameState.Bidding;
    this.currentPlayerId = 0;
  }

  private dealCards(): void {
    for (let i = 0; i < 17; i++) {
      for (const player of this.players) {
        const card = this.deck.dealOne();
        if (card) {
          player.cards.push(card);
        }
      }
    }
    this.landlordCards = this.deck.deal(3);
  }

  bid(playerId: number, bid: number): boolean {
    if (this.gameState !== GameState.Bidding) return false;
    if (playerId !== this.currentPlayerId) return false;
    if (bid <= this.highestBid && bid !== 0) return false;
    if (bid < 0 || bid > 3) return false;

    if (bid === 0) {
      this.passCount++;
      if (this.passCount >= 2 && this.highestBidderId !== null) {
        this.finishBidding();
      } else if (this.passCount >= 3) {
        this.resetGame();
        return true;
      }
    } else {
      this.highestBid = bid;
      this.highestBidderId = playerId;
      this.passCount = 0;
      if (bid === 3) {
        this.finishBidding();
      }
    }

    if (this.gameState === GameState.Bidding) {
      this.currentPlayerId = (this.currentPlayerId + 1) % 3;
    }

    return true;
  }

  private finishBidding(): void {
    if (this.highestBidderId === null) return;
    
    this.landlordPlayerId = this.highestBidderId;
    const landlord = this.players.find(p => p.id === this.landlordPlayerId);
    if (landlord) {
      landlord.role = PlayerRole.Landlord;
      landlord.cards.push(...this.landlordCards);
    }
    
    this.gameState = GameState.Playing;
    this.currentPlayerId = this.landlordPlayerId;
    this.lastPlay = null;
    this.lastPlayerId = null;
  }

  play(playerId: number, cards: Card[]): boolean {
    if (this.gameState !== GameState.Playing) return false;
    if (playerId !== this.currentPlayerId) return false;

    const player = this.players.find(p => p.id === playerId);
    if (!player) return false;

    for (const card of cards) {
      const index = player.cards.findIndex(c => c.equals(card));
      if (index === -1) return false;
    }

    const handResult = DouDiZhuHandAnalyzer.analyze(cards);
    if (!handResult) return false;

    if (this.lastPlay !== null && this.lastPlayerId !== playerId) {
      if (!DouDiZhuHandAnalyzer.compare(handResult, this.lastPlay)) {
        return false;
      }
    }

    for (const card of cards) {
      const index = player.cards.findIndex(c => c.equals(card));
      if (index !== -1) {
        player.cards.splice(index, 1);
      }
    }

    this.lastPlay = handResult;
    this.lastPlayerId = playerId;
    this.passCount = 0;

    if (player.cards.length === 0) {
      this.finishGame(playerId);
    } else {
      this.currentPlayerId = (this.currentPlayerId + 1) % 3;
    }

    return true;
  }

  pass(playerId: number): boolean {
    if (this.gameState !== GameState.Playing) return false;
    if (playerId !== this.currentPlayerId) return false;
    if (this.lastPlay === null) return false;
    if (this.lastPlayerId === playerId) return false;

    this.passCount++;
    if (this.passCount >= 2) {
      this.lastPlay = null;
      this.lastPlayerId = null;
      this.passCount = 0;
    }

    this.currentPlayerId = (this.currentPlayerId + 1) % 3;
    return true;
  }

  private finishGame(winnerId: number): void {
    this.winnerId = winnerId;
    this.gameState = GameState.Finished;
  }

  private resetGame(): void {
    this.deck.reset();
    this.players = [
      { id: 0, cards: [], role: PlayerRole.Farmer },
      { id: 1, cards: [], role: PlayerRole.Farmer },
      { id: 2, cards: [], role: PlayerRole.Farmer }
    ];
    this.landlordCards = [];
    this.currentPlayerId = 0;
    this.landlordPlayerId = null;
    this.highestBid = 0;
    this.highestBidderId = null;
    this.passCount = 0;
    this.lastPlay = null;
    this.lastPlayerId = null;
    this.gameState = GameState.Waiting;
    this.winnerId = null;
  }

  getGameState(): GameState {
    return this.gameState;
  }

  getPlayers(): Player[] {
    return this.players.map(p => ({ ...p, cards: [...p.cards] }));
  }

  getLandlordCards(): Card[] {
    return [...this.landlordCards];
  }

  getCurrentPlayerId(): number {
    return this.currentPlayerId;
  }

  getLandlordPlayerId(): number | null {
    return this.landlordPlayerId;
  }

  getHighestBid(): number {
    return this.highestBid;
  }

  getLastPlay(): HandResult | null {
    return this.lastPlay;
  }

  getWinnerId(): number | null {
    return this.winnerId;
  }
}
