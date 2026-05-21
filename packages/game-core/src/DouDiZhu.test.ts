import { describe, it, expect, beforeEach } from 'vitest';
import { Card, Suit, Rank } from './Card';
import { DouDiZhuHandAnalyzer, HandType, DouDiZhuGame, GameState, PlayerRole } from './DouDiZhu';

describe('DouDiZhuHandAnalyzer', () => {
  describe('analyze', () => {
    it('should recognize single card', () => {
      const card = new Card(Suit.Spades, Rank.Three);
      const result = DouDiZhuHandAnalyzer.analyze([card]);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(HandType.Single);
      expect(result?.mainRank).toBe(Rank.Three);
    });

    it('should recognize pair', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three)
      ];
      const result = DouDiZhuHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(HandType.Pair);
      expect(result?.mainRank).toBe(Rank.Three);
    });

    it('should recognize triple', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Three)
      ];
      const result = DouDiZhuHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(HandType.Triple);
      expect(result?.mainRank).toBe(Rank.Three);
    });

    it('should recognize triple with one', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Three),
        new Card(Suit.Clubs, Rank.Four)
      ];
      const result = DouDiZhuHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(HandType.TripleWithOne);
      expect(result?.mainRank).toBe(Rank.Three);
    });

    it('should recognize triple with two', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Three),
        new Card(Suit.Clubs, Rank.Four),
        new Card(Suit.Spades, Rank.Four)
      ];
      const result = DouDiZhuHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(HandType.TripleWithTwo);
      expect(result?.mainRank).toBe(Rank.Three);
    });

    it('should recognize straight', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Four),
        new Card(Suit.Diamonds, Rank.Five),
        new Card(Suit.Clubs, Rank.Six),
        new Card(Suit.Spades, Rank.Seven)
      ];
      const result = DouDiZhuHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(HandType.Straight);
      expect(result?.mainRank).toBe(Rank.Three);
    });

    it('should recognize double straight', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Four),
        new Card(Suit.Clubs, Rank.Four),
        new Card(Suit.Spades, Rank.Five),
        new Card(Suit.Hearts, Rank.Five)
      ];
      const result = DouDiZhuHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(HandType.DoubleStraight);
      expect(result?.mainRank).toBe(Rank.Three);
    });

    it('should recognize airplane', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Three),
        new Card(Suit.Clubs, Rank.Four),
        new Card(Suit.Spades, Rank.Four),
        new Card(Suit.Hearts, Rank.Four)
      ];
      const result = DouDiZhuHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(HandType.Airplane);
      expect(result?.mainRank).toBe(Rank.Three);
    });

    it('should recognize airplane with wings', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Three),
        new Card(Suit.Clubs, Rank.Four),
        new Card(Suit.Spades, Rank.Four),
        new Card(Suit.Hearts, Rank.Four),
        new Card(Suit.Diamonds, Rank.Five),
        new Card(Suit.Clubs, Rank.Six)
      ];
      const result = DouDiZhuHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(HandType.Airplane);
      expect(result?.mainRank).toBe(Rank.Three);
    });

    it('should recognize quadruple with two singles', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Three),
        new Card(Suit.Clubs, Rank.Three),
        new Card(Suit.Spades, Rank.Four),
        new Card(Suit.Hearts, Rank.Five)
      ];
      const result = DouDiZhuHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(HandType.QuadrupleWithTwo);
      expect(result?.mainRank).toBe(Rank.Three);
    });

    it('should recognize bomb', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Three),
        new Card(Suit.Clubs, Rank.Three)
      ];
      const result = DouDiZhuHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(HandType.Bomb);
      expect(result?.mainRank).toBe(Rank.Three);
    });

    it('should recognize rocket', () => {
      const cards = [Card.createSmallJoker(), Card.createBigJoker()];
      const result = DouDiZhuHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(HandType.Rocket);
    });

    it('should return null for invalid hand', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Five)
      ];
      const result = DouDiZhuHandAnalyzer.analyze(cards);
      expect(result).toBeNull();
    });
  });

  describe('compare', () => {
    it('should compare single cards correctly', () => {
      const small = DouDiZhuHandAnalyzer.analyze([new Card(Suit.Spades, Rank.Three)])!;
      const big = DouDiZhuHandAnalyzer.analyze([new Card(Suit.Spades, Rank.Four)])!;
      expect(DouDiZhuHandAnalyzer.compare(big, small)).toBe(true);
      expect(DouDiZhuHandAnalyzer.compare(small, big)).toBe(false);
    });

    it('should compare pairs correctly', () => {
      const small = DouDiZhuHandAnalyzer.analyze([
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three)
      ])!;
      const big = DouDiZhuHandAnalyzer.analyze([
        new Card(Suit.Spades, Rank.Four),
        new Card(Suit.Hearts, Rank.Four)
      ])!;
      expect(DouDiZhuHandAnalyzer.compare(big, small)).toBe(true);
      expect(DouDiZhuHandAnalyzer.compare(small, big)).toBe(false);
    });

    it('should let bomb beat regular hands', () => {
      const regular = DouDiZhuHandAnalyzer.analyze([new Card(Suit.Spades, Rank.Ace)])!;
      const bomb = DouDiZhuHandAnalyzer.analyze([
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Three),
        new Card(Suit.Clubs, Rank.Three)
      ])!;
      expect(DouDiZhuHandAnalyzer.compare(bomb, regular)).toBe(true);
    });

    it('should let bigger bomb beat smaller bomb', () => {
      const smallBomb = DouDiZhuHandAnalyzer.analyze([
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Three),
        new Card(Suit.Clubs, Rank.Three)
      ])!;
      const bigBomb = DouDiZhuHandAnalyzer.analyze([
        new Card(Suit.Spades, Rank.Four),
        new Card(Suit.Hearts, Rank.Four),
        new Card(Suit.Diamonds, Rank.Four),
        new Card(Suit.Clubs, Rank.Four)
      ])!;
      expect(DouDiZhuHandAnalyzer.compare(bigBomb, smallBomb)).toBe(true);
      expect(DouDiZhuHandAnalyzer.compare(smallBomb, bigBomb)).toBe(false);
    });

    it('should let rocket beat bomb', () => {
      const bomb = DouDiZhuHandAnalyzer.analyze([
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Three),
        new Card(Suit.Clubs, Rank.Three)
      ])!;
      const rocket = DouDiZhuHandAnalyzer.analyze([Card.createSmallJoker(), Card.createBigJoker()])!;
      expect(DouDiZhuHandAnalyzer.compare(rocket, bomb)).toBe(true);
      expect(DouDiZhuHandAnalyzer.compare(bomb, rocket)).toBe(false);
    });

    it('should not let different hand types beat each other', () => {
      const single = DouDiZhuHandAnalyzer.analyze([new Card(Suit.Spades, Rank.Three)])!;
      const pair = DouDiZhuHandAnalyzer.analyze([
        new Card(Suit.Spades, Rank.Ace),
        new Card(Suit.Hearts, Rank.Ace)
      ])!;
      expect(DouDiZhuHandAnalyzer.compare(pair, single)).toBe(false);
    });
  });
});

describe('DouDiZhuGame', () => {
  let game: DouDiZhuGame;

  beforeEach(() => {
    game = new DouDiZhuGame();
  });

  describe('game initialization', () => {
    it('should initialize with waiting state', () => {
      expect(game.getGameState()).toBe(GameState.Waiting);
    });

    it('should have 3 players initially', () => {
      const players = game.getPlayers();
      expect(players.length).toBe(3);
      players.forEach(player => {
        expect(player.cards.length).toBe(0);
        expect(player.role).toBe(PlayerRole.Farmer);
      });
    });
  });

  describe('startGame', () => {
    it('should deal cards and move to bidding state', () => {
      game.startGame();
      expect(game.getGameState()).toBe(GameState.Bidding);
      const players = game.getPlayers();
      players.forEach(player => {
        expect(player.cards.length).toBe(17);
      });
      expect(game.getLandlordCards().length).toBe(3);
    });
  });

  describe('bidding phase', () => {
    beforeEach(() => {
      game.startGame();
    });

    it('should allow bidding', () => {
      expect(game.bid(0, 1)).toBe(true);
      expect(game.getHighestBid()).toBe(1);
    });

    it('should not allow bidding lower than current highest', () => {
      game.bid(0, 1);
      expect(game.bid(1, 1)).toBe(false);
    });

    it('should finish bidding when someone bids 3', () => {
      expect(game.bid(0, 3)).toBe(true);
      expect(game.getGameState()).toBe(GameState.Playing);
    });

    it('should finish bidding after two passes', () => {
      game.bid(0, 1);
      game.bid(1, 0);
      game.bid(2, 0);
      expect(game.getGameState()).toBe(GameState.Playing);
    });

    it('should set landlord correctly', () => {
      game.bid(0, 1);
      game.bid(1, 0);
      game.bid(2, 0);
      expect(game.getLandlordPlayerId()).toBe(0);
      const players = game.getPlayers();
      expect(players[0].role).toBe(PlayerRole.Landlord);
      expect(players[0].cards.length).toBe(20);
    });
  });

  describe('playing phase', () => {
    beforeEach(() => {
      game.startGame();
      game.bid(0, 1);
      game.bid(1, 0);
      game.bid(2, 0);
    });

    it('should start playing phase with landlord', () => {
      expect(game.getCurrentPlayerId()).toBe(0);
    });

    it('should allow playing valid hand', () => {
      const player = game.getPlayers()[0];
      const singleCard = [player.cards[0]];
      expect(game.play(0, singleCard)).toBe(true);
    });

    it('should not allow playing invalid hand', () => {
      const player = game.getPlayers()[0];
      const invalidCards = player.cards.slice(0, 2);
      expect(game.play(0, invalidCards)).toBe(false);
    });

    it('should pass turn after valid play', () => {
      const player = game.getPlayers()[0];
      const singleCard = [player.cards[0]];
      game.play(0, singleCard);
      expect(game.getCurrentPlayerId()).toBe(1);
    });

    it('should allow passing', () => {
      const landlord = game.getPlayers()[0];
      const singleCard = [landlord.cards[0]];
      game.play(0, singleCard);
      expect(game.pass(1)).toBe(true);
    });

    it('should not allow passing first turn', () => {
      expect(game.pass(0)).toBe(false);
    });
  });

  describe('game flow', () => {
    it('should complete a full game cycle', () => {
      game.startGame();
      expect(game.getGameState()).toBe(GameState.Bidding);
      
      game.bid(0, 1);
      game.bid(1, 0);
      game.bid(2, 0);
      expect(game.getGameState()).toBe(GameState.Playing);
      
      const landlord = game.getPlayers()[0];
      const cardToPlay = [landlord.cards[0]];
      game.play(0, cardToPlay);
      
      expect(game.getCurrentPlayerId()).toBe(1);
    });
  });
});
