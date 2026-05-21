import { describe, it, expect, beforeEach } from 'vitest';
import { Deck } from './Deck';
import { Card, Suit, Rank } from './Card';

describe('Deck', () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck();
  });

  describe('constructor and initialization', () => {
    it('should create a deck with 52 cards', () => {
      expect(deck.getRemainingCards()).toBe(52);
    });

    it('should contain all unique cards', () => {
      const cards = deck.getCards();
      const uniqueCards = new Set(cards.map(card => card.toString()));
      expect(uniqueCards.size).toBe(52);
    });

    it('should contain one of each card', () => {
      const cards = deck.getCards();
      for (const suit of Card.getAllSuits()) {
        for (const rank of Card.getAllRanks()) {
          const hasCard = cards.some(card => 
            card.suit === suit && card.rank === rank
          );
          expect(hasCard).toBe(true);
        }
      }
    });
  });

  describe('shuffle', () => {
    it('should shuffle the deck', () => {
      const originalCards = [...deck.getCards()];
      deck.shuffle();
      const shuffledCards = deck.getCards();
      expect(shuffledCards).not.toEqual(originalCards);
    });

    it('should still have 52 cards after shuffle', () => {
      deck.shuffle();
      expect(deck.getRemainingCards()).toBe(52);
    });
  });

  describe('deal', () => {
    it('should deal specified number of cards', () => {
      const dealt = deck.deal(5);
      expect(dealt).toHaveLength(5);
      expect(deck.getRemainingCards()).toBe(47);
    });

    it('should deal one card by default', () => {
      const dealt = deck.deal();
      expect(dealt).toHaveLength(1);
      expect(deck.getRemainingCards()).toBe(51);
    });

    it('should throw error when dealing 0 cards', () => {
      expect(() => deck.deal(0)).toThrow('Must deal at least 1 card');
    });

    it('should throw error when dealing negative cards', () => {
      expect(() => deck.deal(-1)).toThrow('Must deal at least 1 card');
    });

    it('should throw error when not enough cards', () => {
      deck.deal(50);
      expect(() => deck.deal(3)).toThrow('Not enough cards left in the deck');
    });
  });

  describe('dealOne', () => {
    it('should deal one card', () => {
      const card = deck.dealOne();
      expect(card).toBeInstanceOf(Card);
      expect(deck.getRemainingCards()).toBe(51);
    });

    it('should return undefined when deck is empty', () => {
      deck.deal(52);
      const card = deck.dealOne();
      expect(card).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should reset deck to full 52 cards', () => {
      deck.deal(10);
      expect(deck.getRemainingCards()).toBe(42);
      deck.reset();
      expect(deck.getRemainingCards()).toBe(52);
    });
  });

  describe('isEmpty', () => {
    it('should return false when deck has cards', () => {
      expect(deck.isEmpty()).toBe(false);
    });

    it('should return true when deck is empty', () => {
      deck.deal(52);
      expect(deck.isEmpty()).toBe(true);
    });
  });

  describe('getCards', () => {
    it('should return a copy of the cards', () => {
      const cards = deck.getCards();
      cards.pop();
      expect(deck.getRemainingCards()).toBe(52);
    });
  });
});
