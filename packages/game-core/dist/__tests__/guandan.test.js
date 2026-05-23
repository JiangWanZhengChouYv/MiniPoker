import { describe, it, expect } from 'vitest';
import { GuanDanGame } from '../games/guandan';
import { CardUtil } from '../card';
import { Suit, Rank } from '../types';
describe('GuanDanGame', () => {
    describe('constructor', () => {
        it('should create a game with exactly 4 players', () => {
            const game = new GuanDanGame(['Player1', 'Player2', 'Player3', 'Player4']);
            expect(game.getPlayers().length).toBe(4);
        });
        it('should throw error for invalid player count', () => {
            expect(() => new GuanDanGame(['Player1'])).toThrow();
            expect(() => new GuanDanGame(['1', '2', '3'])).toThrow();
        });
    });
    describe('dealCards', () => {
        it('should deal 27 cards to each player', () => {
            const game = new GuanDanGame(['Player1', 'Player2', 'Player3', 'Player4']);
            game.dealCards();
            const players = game.getPlayers();
            expect(players[0].cards.length).toBe(27);
            expect(players[1].cards.length).toBe(27);
            expect(players[2].cards.length).toBe(27);
            expect(players[3].cards.length).toBe(27);
        });
    });
    describe('checkHand', () => {
        it('should check hand types correctly', () => {
            const game = new GuanDanGame(['Player1', 'Player2', 'Player3', 'Player4']);
            const singleCard = [CardUtil.createCard(Suit.SPADE, Rank.ACE)];
            const singleResult = game.checkHand(singleCard);
            expect(singleResult.isValid).toBe(true);
            expect(singleResult.type).toBe('single');
            const bomb = [
                CardUtil.createCard(Suit.SPADE, Rank.ACE),
                CardUtil.createCard(Suit.HEART, Rank.ACE),
                CardUtil.createCard(Suit.CLUB, Rank.ACE),
                CardUtil.createCard(Suit.DIAMOND, Rank.ACE)
            ];
            const bombResult = game.checkHand(bomb);
            expect(bombResult.isValid).toBe(true);
            expect(bombResult.type).toBe('bomb');
        });
    });
    describe('getCurrentLevel', () => {
        it('should start at level 2', () => {
            const game = new GuanDanGame(['Player1', 'Player2', 'Player3', 'Player4']);
            expect(game.getCurrentLevel()).toBe(Rank.TWO);
        });
    });
    describe('isWildCard', () => {
        it('should identify wild cards correctly', () => {
            const game = new GuanDanGame(['Player1', 'Player2', 'Player3', 'Player4']);
            const card = CardUtil.createCard(Suit.SPADE, Rank.TWO);
            expect(game.isWildCard(card)).toBe(true);
        });
    });
});
//# sourceMappingURL=guandan.test.js.map