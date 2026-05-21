import { Card, Suit, Rank } from './Card';

export class Deck {
  private cards: Card[];
  private includeJokers: boolean;

  constructor(includeJokers: boolean = false) {
    this.cards = [];
    this.includeJokers = includeJokers;
    this.initializeDeck(includeJokers);
  }

  private initializeDeck(includeJokers: boolean): void {
    this.cards = [];
    for (const suit of Card.getAllSuits()) {
      for (const rank of Card.getAllRanks()) {
        this.cards.push(new Card(suit, rank));
      }
    }
    if (includeJokers) {
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
    this.initializeDeck(this.includeJokers);
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
