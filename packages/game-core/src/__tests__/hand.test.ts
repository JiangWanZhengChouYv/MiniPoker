import { describe, it, expect } from 'vitest';
import { HandUtil } from '../hand';
import { CardUtil } from '../card';
import { Suit, Rank, HandType, HandResult } from '../types';

describe('HandUtil', () => {
  describe('isSingle', () => {
    it('should identify a single card correctly', () => {
      const card = CardUtil.createCard(Suit.SPADE, Rank.ACE);
      const result = HandUtil.isSingle([card]);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('single');
    });

    it('should return invalid for multiple cards', () => {
      const cards = [
        CardUtil.createCard(Suit.SPADE, Rank.ACE),
        CardUtil.createCard(Suit.HEART, Rank.KING)
      ];
      const result = HandUtil.isSingle(cards);
      expect(result.isValid).toBe(false);
    });
  });

  describe('isPair', () => {
    it('should identify a pair correctly', () => {
      const cards = [
        CardUtil.createCard(Suit.SPADE, Rank.ACE),
        CardUtil.createCard(Suit.HEART, Rank.ACE)
      ];
      const result = HandUtil.isPair(cards);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('pair');
    });

    it('should return invalid for non-pair cards', () => {
      const cards = [
        CardUtil.createCard(Suit.SPADE, Rank.ACE),
        CardUtil.createCard(Suit.HEART, Rank.KING)
      ];
      const result = HandUtil.isPair(cards);
      expect(result.isValid).toBe(false);
    });
  });

  describe('isTriple', () => {
    it('should identify a triple correctly', () => {
      const cards = [
        CardUtil.createCard(Suit.SPADE, Rank.ACE),
        CardUtil.createCard(Suit.HEART, Rank.ACE),
        CardUtil.createCard(Suit.CLUB, Rank.ACE)
      ];
      const result = HandUtil.isTriple(cards);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('triple');
    });
  });

  describe('isBomb', () => {
    it('should identify a bomb correctly', () => {
      const cards = [
        CardUtil.createCard(Suit.SPADE, Rank.ACE),
        CardUtil.createCard(Suit.HEART, Rank.ACE),
        CardUtil.createCard(Suit.CLUB, Rank.ACE),
        CardUtil.createCard(Suit.DIAMOND, Rank.ACE)
      ];
      const result = HandUtil.isBomb(cards);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('bomb');
    });
  });

  describe('isStraight', () => {
    it('should identify a straight correctly', () => {
      const cards = [
        CardUtil.createCard(Suit.SPADE, Rank.TEN),
        CardUtil.createCard(Suit.HEART, Rank.JACK),
        CardUtil.createCard(Suit.CLUB, Rank.QUEEN),
        CardUtil.createCard(Suit.DIAMOND, Rank.KING),
        CardUtil.createCard(Suit.SPADE, Rank.ACE)
      ];
      const result = HandUtil.isStraight(cards);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('straight');
    });
  });

  describe('compareHand', () => {
    it('should compare bombs correctly', () => {
      const bomb1: HandResult = {
        type: HandType.BOMB,
        mainRank: Rank.ACE,
        cards: [],
        isValid: true
      };
      const bomb2: HandResult = {
        type: HandType.BOMB,
        mainRank: Rank.KING,
        cards: [],
        isValid: true
      };
      expect(HandUtil.compareHand(bomb1, bomb2)).toBeGreaterThan(0);
    });

    it('should consider bomb bigger than single', () => {
      const bomb: HandResult = {
        type: HandType.BOMB,
        mainRank: Rank.THREE,
        cards: [],
        isValid: true
      };
      const single: HandResult = {
        type: HandType.SINGLE,
        mainRank: Rank.ACE,
        cards: [],
        isValid: true
      };
      expect(HandUtil.compareHand(bomb, single)).toBeGreaterThan(0);
    });
  });
});
