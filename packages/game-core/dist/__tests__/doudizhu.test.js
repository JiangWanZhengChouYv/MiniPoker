import { describe, it, expect } from 'vitest';
import { DouDiZhuGame } from '../games/doudizhu';
import { CardUtil } from '../card';
import { Suit, Rank } from '../types';
describe('DouDiZhuGame', () => {
    describe('constructor', () => {
        it('should create a game with exactly 3 players', () => {
            const game = new DouDiZhuGame(['Player1', 'Player2', 'Player3']);
            expect(game.getPlayers().length).toBe(3);
        });
        it('should throw error for invalid player count', () => {
            expect(() => new DouDiZhuGame(['Player1'])).toThrow();
            expect(() => new DouDiZhuGame(['1', '2', '3', '4'])).toThrow();
        });
    });
    describe('dealCards', () => {
        it('should deal 17 cards to each player and 3 landlord cards', () => {
            const game = new DouDiZhuGame(['Player1', 'Player2', 'Player3']);
            game.dealCards();
            const players = game.getPlayers();
            expect(players[0].cards.length).toBe(17);
            expect(players[1].cards.length).toBe(17);
            expect(players[2].cards.length).toBe(17);
            expect(game.getLandlordCards().length).toBe(3);
        });
    });
    describe('setLandlord', () => {
        it('should set landlord and give them the landlord cards', () => {
            const game = new DouDiZhuGame(['Player1', 'Player2', 'Player3']);
            game.dealCards();
            game.setLandlord('player_0');
            const landlord = game.getLandlord();
            expect(landlord?.id).toBe('player_0');
            expect(landlord?.cards.length).toBe(20);
            expect(game.getCurrentPlayerId()).toBe('player_0');
        });
    });
    describe('checkHand', () => {
        it('should check hand types correctly', () => {
            const game = new DouDiZhuGame(['Player1', 'Player2', 'Player3']);
            const singleCard = [CardUtil.createCard(Suit.SPADE, Rank.ACE)];
            const singleResult = game.checkHand(singleCard);
            expect(singleResult.isValid).toBe(true);
            expect(singleResult.type).toBe('single');
            const pair = [
                CardUtil.createCard(Suit.SPADE, Rank.ACE),
                CardUtil.createCard(Suit.HEART, Rank.ACE)
            ];
            const pairResult = game.checkHand(pair);
            expect(pairResult.isValid).toBe(true);
            expect(pairResult.type).toBe('pair');
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
    describe('playHand', () => {
        it('should allow playing a valid hand', () => {
            const game = new DouDiZhuGame(['Player1', 'Player2', 'Player3']);
            game.dealCards();
            game.setLandlord('player_0');
            const player = game.getPlayer('player_0');
            if (player && player.cards.length > 0) {
                const singleCard = [player.cards[0]];
                expect(game.playHand('player_0', singleCard)).toBe(true);
            }
        });
    });
});
//# sourceMappingURL=doudizhu.test.js.map