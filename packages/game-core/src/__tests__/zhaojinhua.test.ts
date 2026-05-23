import { describe, it, expect } from 'vitest';
import { ZhaJinHuaGame } from '../games/zhaojinhua';
import { CardUtil } from '../card';
import { Suit, Rank } from '../types';

describe('ZhaJinHuaGame', () => {
  describe('constructor', () => {
    it('should create a game with 2-6 players', () => {
      const game = new ZhaJinHuaGame(['Player1', 'Player2']);
      expect(game.getPlayers().length).toBe(2);
    });

    it('should throw error for invalid player count', () => {
      expect(() => new ZhaJinHuaGame(['Player1'])).toThrow();
      expect(() => new ZhaJinHuaGame(['1', '2', '3', '4', '5', '6', '7'])).toThrow();
    });
  });

  describe('startGame', () => {
    it('should start the game and deal cards', () => {
      const game = new ZhaJinHuaGame(['Player1', 'Player2']);
      game.startGame();
      expect(game.isGameStarted()).toBe(true);
      expect(game.getPlayer('player_0')?.cards.length).toBe(3);
      expect(game.getPlayer('player_1')?.cards.length).toBe(3);
    });
  });

  describe('checkHand', () => {
    it('should identify a straight flush', () => {
      const cards = [
        CardUtil.createCard(Suit.SPADE, Rank.TEN),
        CardUtil.createCard(Suit.SPADE, Rank.JACK),
        CardUtil.createCard(Suit.SPADE, Rank.QUEEN)
      ];
      const result = ZhaJinHuaGame.checkHand(cards);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe(7);
    });

    it('should identify four of a kind (triple)', () => {
      const cards = [
        CardUtil.createCard(Suit.SPADE, Rank.ACE),
        CardUtil.createCard(Suit.HEART, Rank.ACE),
        CardUtil.createCard(Suit.CLUB, Rank.ACE)
      ];
      const result = ZhaJinHuaGame.checkHand(cards);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe(6);
    });

    it('should identify a flush', () => {
      const cards = [
        CardUtil.createCard(Suit.SPADE, Rank.THREE),
        CardUtil.createCard(Suit.SPADE, Rank.SEVEN),
        CardUtil.createCard(Suit.SPADE, Rank.KING)
      ];
      const result = ZhaJinHuaGame.checkHand(cards);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe(4);
    });

    it('should identify a pair', () => {
      const cards = [
        CardUtil.createCard(Suit.SPADE, Rank.ACE),
        CardUtil.createCard(Suit.HEART, Rank.ACE),
        CardUtil.createCard(Suit.CLUB, Rank.KING)
      ];
      const result = ZhaJinHuaGame.checkHand(cards);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe(2);
    });
  });

  describe('compareHands', () => {
    it('should compare hands correctly', () => {
      const straightFlush = { type: 7, mainRank: Rank.ACE, isValid: true };
      const fourOfAKind = { type: 6, mainRank: Rank.ACE, isValid: true };
      expect(ZhaJinHuaGame.compareHands(straightFlush, fourOfAKind)).toBeGreaterThan(0);
    });
  });

  describe('game flow', () => {
    it('should allow betting, calling, and folding', () => {
      const game = new ZhaJinHuaGame(['Player1', 'Player2']);
      game.startGame(10);
      
      expect(game.getCurrentPlayerId()).toBe('player_0');
      expect(game.bet('player_0', 20)).toBe(true);
      expect(game.getCurrentBet()).toBe(20);
      expect(game.getPot()).toBe(20);
      
      expect(game.call('player_1')).toBe(true);
      expect(game.getPot()).toBe(40);
    });
  });
});
