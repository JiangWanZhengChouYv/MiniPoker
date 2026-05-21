export enum Suit {
  Spades = 'spades',
  Hearts = 'hearts',
  Diamonds = 'diamonds',
  Clubs = 'clubs',
  Joker = 'joker'
}

export enum Rank {
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Jack = 11,
  Queen = 12,
  King = 13,
  Ace = 14,
  Two = 15,
  SmallJoker = 16,
  BigJoker = 17
}

export class Card {
  readonly suit: Suit;
  readonly rank: Rank;

  constructor(suit: Suit, rank: Rank) {
    this.suit = suit;
    this.rank = rank;
  }

  getSuitSymbol(): string {
    const symbols: Record<Suit, string> = {
      [Suit.Spades]: '♠',
      [Suit.Hearts]: '♥',
      [Suit.Diamonds]: '♦',
      [Suit.Clubs]: '♣',
      [Suit.Joker]: ''
    };
    return symbols[this.suit];
  }

  getRankSymbol(): string {
    const symbols: Record<Rank, string> = {
      [Rank.Three]: '3',
      [Rank.Four]: '4',
      [Rank.Five]: '5',
      [Rank.Six]: '6',
      [Rank.Seven]: '7',
      [Rank.Eight]: '8',
      [Rank.Nine]: '9',
      [Rank.Ten]: '10',
      [Rank.Jack]: 'J',
      [Rank.Queen]: 'Q',
      [Rank.King]: 'K',
      [Rank.Ace]: 'A',
      [Rank.Two]: '2',
      [Rank.SmallJoker]: '小王',
      [Rank.BigJoker]: '大王'
    };
    return symbols[this.rank];
  }

  toString(): string {
    if (this.isJoker()) {
      return this.getRankSymbol();
    }
    return `${this.getRankSymbol()}${this.getSuitSymbol()}`;
  }

  equals(other: Card): boolean {
    return this.suit === other.suit && this.rank === other.rank;
  }

  isJoker(): boolean {
    return this.suit === Suit.Joker;
  }

  isBigJoker(): boolean {
    return this.rank === Rank.BigJoker;
  }

  isSmallJoker(): boolean {
    return this.rank === Rank.SmallJoker;
  }

  compareTo(other: Card): number {
    return this.rank - other.rank;
  }

  static getAllSuits(): Suit[] {
    return [Suit.Spades, Suit.Hearts, Suit.Diamonds, Suit.Clubs];
  }

  static getAllRanks(): Rank[] {
    return [
      Rank.Three, Rank.Four, Rank.Five, Rank.Six,
      Rank.Seven, Rank.Eight, Rank.Nine, Rank.Ten,
      Rank.Jack, Rank.Queen, Rank.King, Rank.Ace, Rank.Two
    ];
  }

  static createBigJoker(): Card {
    return new Card(Suit.Joker, Rank.BigJoker);
  }

  static createSmallJoker(): Card {
    return new Card(Suit.Joker, Rank.SmallJoker);
  }
}
