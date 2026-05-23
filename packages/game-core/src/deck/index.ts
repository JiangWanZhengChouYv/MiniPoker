import { Card } from '../types';
import { CardUtil } from '../card';

export class Deck {
  private cards: Card[];

  constructor(cards: Card[]) {
    this.cards = [...cards];
  }

  static createStandardDeck(includeJokers: boolean = true): Deck {
    return new Deck(CardUtil.createStandardDeck(includeJokers));
  }

  static createGuanDanDeck(): Deck {
    return new Deck(CardUtil.createGuanDanDeck());
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  shuffleFisherYates(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal(count: number): Card[] {
    if (count > this.cards.length) {
      throw new Error('Not enough cards in deck');
    }
    return this.cards.splice(0, count);
  }

  dealAll(): Card[] {
    return this.cards.splice(0, this.cards.length);
  }

  dealToPlayers(playerCount: number, cardsPerPlayer: number): Card[][] {
    const hands: Card[][] = [];
    for (let i = 0; i < playerCount; i++) {
      hands.push(this.deal(cardsPerPlayer));
    }
    return hands;
  }

  getRemainingCount(): number {
    return this.cards.length;
  }

  getCards(): Card[] {
    return [...this.cards];
  }

  addCard(card: Card): void {
    this.cards.push(card);
  }

  addCards(cards: Card[]): void {
    this.cards.push(...cards);
  }

  reset(cards: Card[]): void {
    this.cards = [...cards];
  }
}
