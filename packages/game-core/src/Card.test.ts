import { describe, it, expect } from 'vitest';
import { Card, Suit, Rank } from './Card';

describe('Card', () => {
  describe('constructor', () => {
    it('should create a card with given suit and rank', () => {
      const card = new Card(Suit.Spades, Rank.Ace);
      expect(card.suit).toBe(Suit.Spades);
      expect(card.rank).toBe(Rank.Ace);
    });
  });

  describe('getSuitSymbol', () => {
    it('should return correct suit symbols', () => {
      expect(new Card(Suit.Spades, Rank.Two).getSuitSymbol()).toBe('♠');
      expect(new Card(Suit.Hearts, Rank.Two).getSuitSymbol()).toBe('♥');
      expect(new Card(Suit.Diamonds, Rank.Two).getSuitSymbol()).toBe('♦');
      expect(new Card(Suit.Clubs, Rank.Two).getSuitSymbol()).toBe('♣');
    });
  });

  describe('getRankSymbol', () => {
    it('should return correct rank symbols', () => {
      expect(new Card(Suit.Spades, Rank.Two).getRankSymbol()).toBe('2');
      expect(new Card(Suit.Spades, Rank.Ten).getRankSymbol()).toBe('10');
      expect(new Card(Suit.Spades, Rank.Jack).getRankSymbol()).toBe('J');
      expect(new Card(Suit.Spades, Rank.Queen).getRankSymbol()).toBe('Q');
      expect(new Card(Suit.Spades, Rank.King).getRankSymbol()).toBe('K');
      expect(new Card(Suit.Spades, Rank.Ace).getRankSymbol()).toBe('A');
    });
  });

  describe('toString', () => {
    it('should return correct string representation', () => {
      expect(new Card(Suit.Spades, Rank.Ace).toString()).toBe('A♠');
      expect(new Card(Suit.Hearts, Rank.King).toString()).toBe('K♥');
      expect(new Card(Suit.Diamonds, Rank.Queen).toString()).toBe('Q♦');
      expect(new Card(Suit.Clubs, Rank.Ten).toString()).toBe('10♣');
    });
  });

  describe('equals', () => {
    it('should return true for cards with same suit and rank', () => {
      const card1 = new Card(Suit.Spades, Rank.Ace);
      const card2 = new Card(Suit.Spades, Rank.Ace);
      expect(card1.equals(card2)).toBe(true);
    });

    it('should return false for cards with different suit or rank', () => {
      const card1 = new Card(Suit.Spades, Rank.Ace);
      const card2 = new Card(Suit.Hearts, Rank.Ace);
      const card3 = new Card(Suit.Spades, Rank.King);
      expect(card1.equals(card2)).toBe(false);
      expect(card1.equals(card3)).toBe(false);
    });
  });

  describe('static methods', () => {
    it('should return all 4 suits', () => {
      const suits = Card.getAllSuits();
      expect(suits).toHaveLength(4);
      expect(suits).toContain(Suit.Spades);
      expect(suits).toContain(Suit.Hearts);
      expect(suits).toContain(Suit.Diamonds);
      expect(suits).toContain(Suit.Clubs);
    });

    it('should return all 13 ranks', () => {
      const ranks = Card.getAllRanks();
      expect(ranks).toHaveLength(13);
    });
  });
});
