import { describe, it, expect } from 'vitest';
import { Card, Suit, Rank } from './Card';
import { ZhaJinHuaHandAnalyzer, ZhaJinHuaHandType, ZhaJinHuaGame, ZhaJinHuaActionType } from './ZhaJinHua';

describe('ZhaJinHuaHandAnalyzer', () => {
  describe('analyze', () => {
    it('should identify single card', () => {
      const cards = [new Card(Suit.Hearts, Rank.Ace)];
      const result = ZhaJinHuaHandAnalyzer.analyze(cards);
      expect(result).toBeNull();
    });

    it('should identify pair', () => {
      const cards = [
        new Card(Suit.Hearts, Rank.Ace),
        new Card(Suit.Diamonds, Rank.Ace),
        new Card(Suit.Clubs, Rank.King)
      ];
      const result = ZhaJinHuaHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(ZhaJinHuaHandType.Pair);
      expect(result?.mainRank).toBe(Rank.Ace);
    });

    it('should identify straight', () => {
      const cards = [
        new Card(Suit.Hearts, Rank.Ten),
        new Card(Suit.Diamonds, Rank.Jack),
        new Card(Suit.Clubs, Rank.Queen)
      ];
      const result = ZhaJinHuaHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(ZhaJinHuaHandType.Straight);
    });

    it('should identify flush', () => {
      const cards = [
        new Card(Suit.Hearts, Rank.Ten),
        new Card(Suit.Hearts, Rank.King),
        new Card(Suit.Hearts, Rank.Ace)
      ];
      const result = ZhaJinHuaHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(ZhaJinHuaHandType.Flush);
    });

    it('should identify full house (triple)', () => {
      const cards = [
        new Card(Suit.Hearts, Rank.Ace),
        new Card(Suit.Diamonds, Rank.Ace),
        new Card(Suit.Clubs, Rank.Ace)
      ];
      const result = ZhaJinHuaHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(ZhaJinHuaHandType.FullHouse);
      expect(result?.mainRank).toBe(Rank.Ace);
    });

    it('should identify straight flush', () => {
      const cards = [
        new Card(Suit.Hearts, Rank.Ten),
        new Card(Suit.Hearts, Rank.Jack),
        new Card(Suit.Hearts, Rank.Queen)
      ];
      const result = ZhaJinHuaHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(ZhaJinHuaHandType.StraightFlush);
    });

    it('should return null for invalid card count', () => {
      const cards = [
        new Card(Suit.Hearts, Rank.Ace),
        new Card(Suit.Diamonds, Rank.Ace)
      ];
      const result = ZhaJinHuaHandAnalyzer.analyze(cards);
      expect(result).toBeNull();
    });
  });

  describe('compare', () => {
    it('should compare different hand types correctly', () => {
      const singleCards = [
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Five),
        new Card(Suit.Clubs, Rank.Seven)
      ];
      const singleResult = ZhaJinHuaHandAnalyzer.analyze(singleCards);

      const pairCards = [
        new Card(Suit.Hearts, Rank.Ten),
        new Card(Suit.Diamonds, Rank.Ten),
        new Card(Suit.Clubs, Rank.King)
      ];
      const pairResult = ZhaJinHuaHandAnalyzer.analyze(pairCards);

      expect(singleResult).not.toBeNull();
      expect(pairResult).not.toBeNull();
      
      if (singleResult && pairResult) {
        expect(ZhaJinHuaHandAnalyzer.compare(pairResult, singleResult)).toBe(true);
        expect(ZhaJinHuaHandAnalyzer.compare(singleResult, pairResult)).toBe(false);
      }
    });

    it('should compare same hand types by main rank', () => {
      const lowPairCards = [
        new Card(Suit.Hearts, Rank.Ten),
        new Card(Suit.Diamonds, Rank.Ten),
        new Card(Suit.Clubs, Rank.King)
      ];
      const lowPairResult = ZhaJinHuaHandAnalyzer.analyze(lowPairCards);

      const highPairCards = [
        new Card(Suit.Hearts, Rank.Ace),
        new Card(Suit.Diamonds, Rank.Ace),
        new Card(Suit.Clubs, Rank.King)
      ];
      const highPairResult = ZhaJinHuaHandAnalyzer.analyze(highPairCards);

      expect(lowPairResult).not.toBeNull();
      expect(highPairResult).not.toBeNull();
      
      if (lowPairResult && highPairResult) {
        expect(ZhaJinHuaHandAnalyzer.compare(highPairResult, lowPairResult)).toBe(true);
        expect(ZhaJinHuaHandAnalyzer.compare(lowPairResult, highPairResult)).toBe(false);
      }
    });
  });
});

describe('ZhaJinHuaGame', () => {
  describe('game initialization', () => {
    it('should create a game with 3 players by default', () => {
      const game = new ZhaJinHuaGame();
      const players = game.getPlayers();
      expect(players.length).toBe(3);
      expect(players[0].id).toBe(0);
      expect(players[1].id).toBe(1);
      expect(players[2].id).toBe(2);
    });

    it('should start in waiting state', () => {
      const game = new ZhaJinHuaGame();
      expect(game.getGameState()).toBe('waiting');
    });
  });

  describe('game flow', () => {
    it('should deal cards when starting game', () => {
      const game = new ZhaJinHuaGame();
      game.startGame();
      const players = game.getPlayers();
      
      expect(players[0].cards.length).toBe(3);
      expect(players[1].cards.length).toBe(3);
      expect(players[2].cards.length).toBe(3);
    });

    it('should allow players to take actions', () => {
      const game = new ZhaJinHuaGame();
      game.startGame();
      
      const firstPlayerId = game.getCurrentPlayerId();
      const result = game.takeAction({
        playerId: firstPlayerId,
        type: ZhaJinHuaActionType.Fold
      });
      
      expect(result).toBe(true);
    });

    it('should not allow invalid player to take action', () => {
      const game = new ZhaJinHuaGame();
      game.startGame();
      
      const currentPlayerId = game.getCurrentPlayerId();
      const invalidPlayerId = (currentPlayerId + 1) % 3;
      
      const result = game.takeAction({
        playerId: invalidPlayerId,
        type: ZhaJinHuaActionType.Fold
      });
      
      expect(result).toBe(false);
    });
  });
});
