import { Card, Suit, Rank } from './Card';
import { BaseHandResult, BaseGamePlayer, BaseGameState, BaseGame } from './GameBase';

export enum GuanDanHandType {
  Single = 'single',
  Pair = 'pair',
  Triple = 'triple',
  TripleWithOne = 'tripleWithOne',
  TripleWithTwo = 'tripleWithTwo',
  Straight = 'straight',
  DoubleStraight = 'doubleStraight',
  TripleStraight = 'tripleStraight',
  Bomb = 'bomb',
  FourWithTwo = 'fourWithTwo',
  FourWithTwoPairs = 'fourWithTwoPairs',
  StraightBomb = 'straightBomb',
  JokerBomb = 'jokerBomb'
}

export interface GuanDanHandResult extends BaseHandResult {
  type: GuanDanHandType;
  mainRank: Rank;
  length: number;
  cards: Card[];
}

export class GuanDanDeck {
  private cards: Card[];

  constructor() {
    this.cards = [];
    this.initializeDeck();
  }

  private initializeDeck(): void {
    this.cards = [];
    for (let deck = 0; deck < 2; deck++) {
      for (const suit of Card.getAllSuits()) {
        for (const rank of Card.getAllRanks()) {
          this.cards.push(new Card(suit, rank));
        }
      }
      this.cards.push(Card.createSmallJoker());
      this.cards.push(Card.createBigJoker());
    }
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal(count: number = 1): Card[] {
    if (count < 1) {
      throw new Error('Must deal at least 1 card');
    }
    if (count > this.cards.length) {
      throw new Error('Not enough cards left in the deck');
    }
    return this.cards.splice(-count);
  }

  dealOne(): Card | undefined {
    return this.cards.pop();
  }

  reset(): void {
    this.initializeDeck();
  }

  getRemainingCards(): number {
    return this.cards.length;
  }

  isEmpty(): boolean {
    return this.cards.length === 0;
  }

  getCards(): Card[] {
    return [...this.cards];
  }
}

export class GuanDanHandAnalyzer {
  static analyze(cards: Card[]): GuanDanHandResult | null {
    if (cards.length === 0) return null;

    const sortedCards = [...cards].sort((a, b) => a.compareTo(b));
    const rankCounts = this.getRankCounts(sortedCards);
    const jokerCount = sortedCards.filter(c => c.isJoker()).length;

    const jokerBomb = this.checkJokerBomb(sortedCards, jokerCount);
    if (jokerBomb) return jokerBomb;

    const straightBomb = this.checkStraightBomb(sortedCards, rankCounts);
    if (straightBomb) return straightBomb;

    const bomb = this.checkBomb(sortedCards, rankCounts);
    if (bomb) return bomb;

    const fourWithTwoPairs = this.checkFourWithTwoPairs(sortedCards, rankCounts);
    if (fourWithTwoPairs) return fourWithTwoPairs;

    const fourWithTwo = this.checkFourWithTwo(sortedCards, rankCounts);
    if (fourWithTwo) return fourWithTwo;

    const tripleStraight = this.checkTripleStraight(sortedCards, rankCounts);
    if (tripleStraight) return tripleStraight;

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

  private static checkJokerBomb(cards: Card[], jokerCount: number): GuanDanHandResult | null {
    if (jokerCount >= 4) {
      return {
        type: GuanDanHandType.JokerBomb,
        mainRank: Rank.BigJoker,
        length: cards.length,
        cards
      };
    }
    return null;
  }

  private static checkBomb(cards: Card[], rankCounts: Map<Rank, number>): GuanDanHandResult | null {
    for (const [rank, count] of rankCounts) {
      if (count >= 4) {
        return {
          type: GuanDanHandType.Bomb,
          mainRank: rank,
          length: count,
          cards
        };
      }
    }
    return null;
  }

  private static checkStraightBomb(cards: Card[], rankCounts: Map<Rank, number>): GuanDanHandResult | null {
    if (cards.length < 12) return null; // 至少需要3个连续炸弹，每个4张

    const bombs: Rank[] = [];
    for (const [rank, count] of rankCounts) {
      if (count === 4) {
        bombs.push(rank);
      }
    }

    if (bombs.length < 3) return null;

    bombs.sort((a, b) => a - b);

    for (let i = 1; i < bombs.length; i++) {
      if (bombs[i] !== bombs[i - 1] + 1) {
        return null;
      }
    }

    return {
      type: GuanDanHandType.StraightBomb,
      mainRank: bombs[0],
      length: bombs.length,
      cards
    };
  }

  private static checkFourWithTwo(cards: Card[], rankCounts: Map<Rank, number>): GuanDanHandResult | null {
    if (cards.length !== 6) return null;

    let fourRank: Rank | null = null;
    let singleCount = 0;

    for (const [rank, count] of rankCounts) {
      if (count === 4) {
        fourRank = rank;
      } else if (count === 1) {
        singleCount++;
      }
    }

    if (fourRank && singleCount === 2) {
      return {
        type: GuanDanHandType.FourWithTwo,
        mainRank: fourRank,
        length: 6,
        cards
      };
    }

    return null;
  }

  private static checkFourWithTwoPairs(cards: Card[], rankCounts: Map<Rank, number>): GuanDanHandResult | null {
    if (cards.length !== 8) return null;

    let fourRank: Rank | null = null;
    let pairCount = 0;

    for (const [rank, count] of rankCounts) {
      if (count === 4) {
        fourRank = rank;
      } else if (count === 2) {
        pairCount++;
      }
    }

    if (fourRank && pairCount === 2) {
      return {
        type: GuanDanHandType.FourWithTwoPairs,
        mainRank: fourRank,
        length: 8,
        cards
      };
    }

    return null;
  }

  private static checkTripleStraight(cards: Card[], rankCounts: Map<Rank, number>): GuanDanHandResult | null {
    const triples: Rank[] = [];
    for (const [rank, count] of rankCounts) {
      if (count === 3) {
        triples.push(rank);
      }
    }

    if (triples.length < 2) return null;

    triples.sort((a, b) => a - b);

    for (let i = 1; i < triples.length; i++) {
      if (triples[i] !== triples[i - 1] + 1) {
        return null;
      }
    }

    return {
      type: GuanDanHandType.TripleStraight,
      mainRank: triples[0],
      length: triples.length,
      cards
    };
  }

  private static checkDoubleStraight(cards: Card[], rankCounts: Map<Rank, number>): GuanDanHandResult | null {
    if (cards.length < 6 || cards.length % 2 !== 0) return null;

    const pairs: Rank[] = [];
    for (const [rank, count] of rankCounts) {
      if (count === 2) {
        pairs.push(rank);
      }
    }

    if (pairs.length < 3) return null;

    pairs.sort((a, b) => a - b);

    for (let i = 1; i < pairs.length; i++) {
      if (pairs[i] !== pairs[i - 1] + 1) {
        return null;
      }
    }

    return {
      type: GuanDanHandType.DoubleStraight,
      mainRank: pairs[0],
      length: pairs.length,
      cards
    };
  }

  private static checkStraight(cards: Card[], rankCounts: Map<Rank, number>): GuanDanHandResult | null {
    if (cards.length < 5) return null;

    for (const [, count] of rankCounts) {
      if (count !== 1) return null;
    }

    const ranks = Array.from(rankCounts.keys()).sort((a, b) => a - b);

    for (let i = 1; i < ranks.length; i++) {
      if (ranks[i] !== ranks[i - 1] + 1) {
        return null;
      }
    }

    return {
      type: GuanDanHandType.Straight,
      mainRank: ranks[0],
      length: ranks.length,
      cards
    };
  }

  private static checkTripleWithTwo(cards: Card[], rankCounts: Map<Rank, number>): GuanDanHandResult | null {
    if (cards.length !== 5) return null;

    let tripleRank: Rank | null = null;
    let hasPair = false;

    for (const [rank, count] of rankCounts) {
      if (count === 3) {
        tripleRank = rank;
      } else if (count === 2) {
        hasPair = true;
      }
    }

    if (tripleRank && hasPair) {
      return {
        type: GuanDanHandType.TripleWithTwo,
        mainRank: tripleRank,
        length: 5,
        cards
      };
    }

    return null;
  }

  private static checkTripleWithOne(cards: Card[], rankCounts: Map<Rank, number>): GuanDanHandResult | null {
    if (cards.length !== 4) return null;

    let tripleRank: Rank | null = null;
    let hasSingle = false;

    for (const [rank, count] of rankCounts) {
      if (count === 3) {
        tripleRank = rank;
      } else if (count === 1) {
        hasSingle = true;
      }
    }

    if (tripleRank && hasSingle) {
      return {
        type: GuanDanHandType.TripleWithOne,
        mainRank: tripleRank,
        length: 4,
        cards
      };
    }

    return null;
  }

  private static checkTriple(cards: Card[], rankCounts: Map<Rank, number>): GuanDanHandResult | null {
    if (cards.length !== 3) return null;

    for (const [rank, count] of rankCounts) {
      if (count === 3) {
        return {
          type: GuanDanHandType.Triple,
          mainRank: rank,
          length: 3,
          cards
        };
      }
    }

    return null;
  }

  private static checkPair(cards: Card[], rankCounts: Map<Rank, number>): GuanDanHandResult | null {
    if (cards.length !== 2) return null;

    for (const [rank, count] of rankCounts) {
      if (count === 2) {
        return {
          type: GuanDanHandType.Pair,
          mainRank: rank,
          length: 2,
          cards
        };
      }
    }

    return null;
  }

  private static checkSingle(cards: Card[]): GuanDanHandResult | null {
    if (cards.length !== 1) return null;
    return {
      type: GuanDanHandType.Single,
      mainRank: cards[0].rank,
      length: 1,
      cards
    };
  }

  static compare(current: GuanDanHandResult, previous: GuanDanHandResult): boolean {
    const bombTypes = [
      GuanDanHandType.JokerBomb,
      GuanDanHandType.StraightBomb,
      GuanDanHandType.Bomb
    ];

    const currentIsBomb = bombTypes.includes(current.type);
    const previousIsBomb = bombTypes.includes(previous.type);

    if (currentIsBomb && !previousIsBomb) {
      return true;
    }

    if (!currentIsBomb && previousIsBomb) {
      return false;
    }

    if (currentIsBomb && previousIsBomb) {
      if (current.type !== previous.type) {
        if (current.type === GuanDanHandType.JokerBomb) return true;
        if (previous.type === GuanDanHandType.JokerBomb) return false;
        if (current.type === GuanDanHandType.StraightBomb) return true;
        if (previous.type === GuanDanHandType.StraightBomb) return false;
      }
      
      if (current.length !== previous.length) {
        return current.length > previous.length;
      }
      
      return current.mainRank > previous.mainRank;
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

export enum GuanDanGameState {
  Waiting = 'waiting',
  Dealing = 'dealing',
  Playing = 'playing',
  Finished = 'finished'
}

export enum GuanDanTeam {
  TeamA = 'teamA',
  TeamB = 'teamB'
}

export interface GuanDanPlayer extends BaseGamePlayer {
  team: GuanDanTeam;
  isFirst: boolean;
}

export interface GuanDanPlayAction {
  playerId: number;
  cards: Card[];
}

export class GuanDanGame implements BaseGame<GuanDanPlayer, GuanDanHandResult> {
  private deck: GuanDanDeck;
  private players: GuanDanPlayer[];
  private currentPlayerId: number;
  private gameState: GuanDanGameState;
  private winnerId: number | null;
  private lastPlay: GuanDanHandResult | null;
  private lastPlayerId: number | null;
  private passCount: number;

  constructor() {
    this.deck = new GuanDanDeck();
    this.players = [
      { id: 0, cards: [], team: GuanDanTeam.TeamA, isFirst: false },
      { id: 1, cards: [], team: GuanDanTeam.TeamB, isFirst: false },
      { id: 2, cards: [], team: GuanDanTeam.TeamA, isFirst: false },
      { id: 3, cards: [], team: GuanDanTeam.TeamB, isFirst: false }
    ];
    this.currentPlayerId = 0;
    this.gameState = GuanDanGameState.Waiting;
    this.winnerId = null;
    this.lastPlay = null;
    this.lastPlayerId = null;
    this.passCount = 0;
  }

  startGame(): void {
    this.deck.reset();
    this.deck.shuffle();
    this.gameState = GuanDanGameState.Dealing;
    
    this.players.forEach(p => {
      p.cards = [];
      p.isFirst = false;
    });
    
    this.dealCards();
    this.gameState = GuanDanGameState.Playing;
    
    const playerWithThreeOfHearts = this.findPlayerWithCard(Suit.Hearts, Rank.Three);
    this.currentPlayerId = playerWithThreeOfHearts;
    this.players[playerWithThreeOfHearts].isFirst = true;
    
    this.lastPlay = null;
    this.lastPlayerId = null;
    this.passCount = 0;
    this.winnerId = null;
  }

  private findPlayerWithCard(suit: Suit, rank: Rank): number {
    for (const player of this.players) {
      for (const card of player.cards) {
        if (card.suit === suit && card.rank === rank) {
          return player.id;
        }
      }
    }
    return 0;
  }

  private dealCards(): void {
    const totalCards = 27;
    for (let i = 0; i < totalCards; i++) {
      for (const player of this.players) {
        const card = this.deck.dealOne();
        if (card) {
          player.cards.push(card);
        }
      }
    }
  }

  play(action: GuanDanPlayAction): boolean {
    if (this.gameState !== GuanDanGameState.Playing) return false;
    if (action.playerId !== this.currentPlayerId) return false;

    const player = this.players.find(p => p.id === action.playerId);
    if (!player) return false;

    for (const card of action.cards) {
      const index = player.cards.findIndex(c => c.suit === card.suit && c.rank === card.rank);
      if (index === -1) return false;
    }

    const handResult = GuanDanHandAnalyzer.analyze(action.cards);
    if (!handResult) return false;

    if (this.lastPlay !== null && this.lastPlayerId !== action.playerId) {
      if (!GuanDanHandAnalyzer.compare(handResult, this.lastPlay)) {
        return false;
      }
    }

    for (const card of action.cards) {
      const index = player.cards.findIndex(c => c.suit === card.suit && c.rank === card.rank);
      if (index !== -1) {
        player.cards.splice(index, 1);
      }
    }

    this.lastPlay = handResult;
    this.lastPlayerId = action.playerId;
    this.passCount = 0;

    if (player.cards.length === 0) {
      this.finishGame(action.playerId);
    } else {
      this.nextPlayer();
    }

    return true;
  }

  pass(playerId: number): boolean {
    if (this.gameState !== GuanDanGameState.Playing) return false;
    if (playerId !== this.currentPlayerId) return false;
    if (this.lastPlay === null) return false;
    if (this.lastPlayerId === playerId) return false;

    this.passCount++;
    if (this.passCount >= 3) {
      this.lastPlay = null;
      this.lastPlayerId = null;
      this.passCount = 0;
    }

    this.nextPlayer();
    return true;
  }

  private nextPlayer(): void {
    this.currentPlayerId = (this.currentPlayerId + 1) % 4;
  }

  private finishGame(winnerId: number): void {
    this.winnerId = winnerId;
    this.gameState = GuanDanGameState.Finished;
  }

  getGameState(): GuanDanGameState {
    return this.gameState;
  }

  getPlayers(): GuanDanPlayer[] {
    return this.players.map(p => ({ ...p, cards: [...p.cards] }));
  }

  getCurrentPlayerId(): number {
    return this.currentPlayerId;
  }

  getWinnerId(): number | null {
    return this.winnerId;
  }

  getLastPlay(): GuanDanHandResult | null {
    return this.lastPlay;
  }
}
