import { describe, it, expect } from 'vitest';
import { CardUtil } from '../card';
import { Suit, Rank } from '../types';
describe('CardUtil', () => {
    describe('createCard', () => {
        it('should create a valid card', () => {
            const card = CardUtil.createCard(Suit.SPADE, Rank.ACE);
            expect(card.suit).toBe(Suit.SPADE);
            expect(card.rank).toBe(Rank.ACE);
            expect(card.id).toBe('spade_14');
        });
    });
    describe('createStandardDeck', () => {
        it('should create a standard deck with 54 cards including jokers', () => {
            const deck = CardUtil.createStandardDeck(true);
            expect(deck.length).toBe(54);
        });
        it('should create a standard deck with 52 cards without jokers', () => {
            const deck = CardUtil.createStandardDeck(false);
            expect(deck.length).toBe(52);
        });
    });
    describe('createGuanDanDeck', () => {
        it('should create a guandan deck with 108 cards', () => {
            const deck = CardUtil.createGuanDanDeck();
            expect(deck.length).toBe(108);
        });
    });
    describe('sortCards', () => {
        it('should sort cards in ascending order', () => {
            const cards = [
                CardUtil.createCard(Suit.SPADE, Rank.KING),
                CardUtil.createCard(Suit.HEART, Rank.TEN),
                CardUtil.createCard(Suit.CLUB, Rank.ACE)
            ];
            const sorted = CardUtil.sortCards(cards, true);
            expect(sorted[0].rank).toBe(Rank.TEN);
            expect(sorted[1].rank).toBe(Rank.KING);
            expect(sorted[2].rank).toBe(Rank.ACE);
        });
        it('should sort cards in descending order', () => {
            const cards = [
                CardUtil.createCard(Suit.SPADE, Rank.KING),
                CardUtil.createCard(Suit.HEART, Rank.TEN),
                CardUtil.createCard(Suit.CLUB, Rank.ACE)
            ];
            const sorted = CardUtil.sortCards(cards, false);
            expect(sorted[0].rank).toBe(Rank.ACE);
            expect(sorted[1].rank).toBe(Rank.KING);
            expect(sorted[2].rank).toBe(Rank.TEN);
        });
    });
    describe('getRankCounts', () => {
        it('should return correct rank counts', () => {
            const cards = [
                CardUtil.createCard(Suit.SPADE, Rank.KING),
                CardUtil.createCard(Suit.HEART, Rank.KING),
                CardUtil.createCard(Suit.CLUB, Rank.ACE)
            ];
            const counts = CardUtil.getRankCounts(cards);
            expect(counts.get(Rank.KING)).toBe(2);
            expect(counts.get(Rank.ACE)).toBe(1);
        });
    });
    describe('isJoker', () => {
        it('should identify jokers correctly', () => {
            const blackJoker = CardUtil.createCard(Suit.BLACK_JOKER, Rank.BLACK_JOKER);
            const redJoker = CardUtil.createCard(Suit.RED_JOKER, Rank.RED_JOKER);
            const normalCard = CardUtil.createCard(Suit.SPADE, Rank.ACE);
            expect(CardUtil.isJoker(blackJoker)).toBe(true);
            expect(CardUtil.isJoker(redJoker)).toBe(true);
            expect(CardUtil.isJoker(normalCard)).toBe(false);
        });
    });
});
//# sourceMappingURL=card.test.js.map