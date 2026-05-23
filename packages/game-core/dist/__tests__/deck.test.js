import { describe, it, expect } from 'vitest';
import { Deck } from '../deck';
describe('Deck', () => {
    describe('createStandardDeck', () => {
        it('should create a standard deck with 54 cards', () => {
            const deck = Deck.createStandardDeck(true);
            expect(deck.getRemainingCount()).toBe(54);
        });
    });
    describe('createGuanDanDeck', () => {
        it('should create a guandan deck with 108 cards', () => {
            const deck = Deck.createGuanDanDeck();
            expect(deck.getRemainingCount()).toBe(108);
        });
    });
    describe('shuffle', () => {
        it('should shuffle the deck', () => {
            const deck = Deck.createStandardDeck(true);
            const originalCards = [...deck.getCards()];
            deck.shuffle();
            const shuffledCards = deck.getCards();
            expect(shuffledCards).not.toEqual(originalCards);
        });
    });
    describe('deal', () => {
        it('should deal the specified number of cards', () => {
            const deck = Deck.createStandardDeck(true);
            const dealt = deck.deal(5);
            expect(dealt.length).toBe(5);
            expect(deck.getRemainingCount()).toBe(49);
        });
        it('should throw error when not enough cards', () => {
            const deck = Deck.createStandardDeck(true);
            deck.deal(50);
            expect(() => deck.deal(10)).toThrow('Not enough cards in deck');
        });
    });
    describe('dealToPlayers', () => {
        it('should deal cards to multiple players', () => {
            const deck = Deck.createStandardDeck(true);
            const hands = deck.dealToPlayers(3, 17);
            expect(hands.length).toBe(3);
            expect(hands[0].length).toBe(17);
            expect(hands[1].length).toBe(17);
            expect(hands[2].length).toBe(17);
            expect(deck.getRemainingCount()).toBe(3);
        });
    });
});
//# sourceMappingURL=deck.test.js.map