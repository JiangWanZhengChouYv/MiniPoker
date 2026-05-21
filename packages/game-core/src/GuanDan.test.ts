import { describe, it, expect } from 'vitest';
import { Card, Suit, Rank } from './Card';
import { GuanDanHandAnalyzer, GuanDanHandType, GuanDanGame, GuanDanDeck } from './GuanDan';

describe('GuanDanDeck', () => {
  it('should initialize with 2 full decks (108 cards)', () => {
    const deck = new GuanDanDeck();
    expect(deck.getRemainingCards()).toBe(108);
  });

  it('should shuffle and deal cards correctly', () => {
    const deck = new GuanDanDeck();
    deck.shuffle();
    
    const cards = deck.deal(5);
    expect(cards.length).toBe(5);
    expect(deck.getRemainingCards()).toBe(103);
  });

  it('should reset to full deck', () => {
    const deck = new GuanDanDeck();
    deck.deal(50);
    expect(deck.getRemainingCards()).toBe(58);
    
    deck.reset();
    expect(deck.getRemainingCards()).toBe(108);
  });
});

describe('GuanDanHandAnalyzer', () => {
  describe('analyze', () => {
    it('should identify single card', () => {
      const cards = [new Card(Suit.Hearts, Rank.Ace)];
      const result = GuanDanHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(GuanDanHandType.Single);
      expect(result?.mainRank).toBe(Rank.Ace);
    });

    it('should identify pair', () => {
      const cards = [
        new Card(Suit.Hearts, Rank.Ace),
        new Card(Suit.Diamonds, Rank.Ace)
      ];
      const result = GuanDanHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(GuanDanHandType.Pair);
    });

    it('should identify triple', () => {
      const cards = [
        new Card(Suit.Hearts, Rank.Ace),
        new Card(Suit.Diamonds, Rank.Ace),
        new Card(Suit.Clubs, Rank.Ace)
      ];
      const result = GuanDanHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(GuanDanHandType.Triple);
    });

    it('should identify straight', () => {
      const cards = [
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Four),
        new Card(Suit.Clubs, Rank.Five),
        new Card(Suit.Spades, Rank.Six),
        new Card(Suit.Hearts, Rank.Seven)
      ];
      const result = GuanDanHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(GuanDanHandType.Straight);
    });

    it('should identify double straight', () => {
      const cards = [
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Three),
        new Card(Suit.Clubs, Rank.Four),
        new Card(Suit.Spades, Rank.Four),
        new Card(Suit.Hearts, Rank.Five),
        new Card(Suit.Diamonds, Rank.Five)
      ];
      const result = GuanDanHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(GuanDanHandType.DoubleStraight);
    });

    it('should identify bomb (4 of a kind)', () => {
      const cards = [
        new Card(Suit.Hearts, Rank.Ace),
        new Card(Suit.Diamonds, Rank.Ace),
        new Card(Suit.Clubs, Rank.Ace),
        new Card(Suit.Spades, Rank.Ace)
      ];
      const result = GuanDanHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(GuanDanHandType.Bomb);
    });

    it('should identify triple with one', () => {
      const cards = [
        new Card(Suit.Hearts, Rank.Ace),
        new Card(Suit.Diamonds, Rank.Ace),
        new Card(Suit.Clubs, Rank.Ace),
        new Card(Suit.Spades, Rank.King)
      ];
      const result = GuanDanHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(GuanDanHandType.TripleWithOne);
    });

    it('should identify triple with two', () => {
      const cards = [
        new Card(Suit.Hearts, Rank.Ace),
        new Card(Suit.Diamonds, Rank.Ace),
        new Card(Suit.Clubs, Rank.Ace),
        new Card(Suit.Spades, Rank.King),
        new Card(Suit.Hearts, Rank.King)
      ];
      const result = GuanDanHandAnalyzer.analyze(cards);
      expect(result).not.toBeNull();
      expect(result?.type).toBe(GuanDanHandType.TripleWithTwo);
    });

    it('should return null for empty cards', () => {
      const result = GuanDanHandAnalyzer.analyze([]);
      expect(result).toBeNull();
    });
  });

  describe('compare', () => {
    it('should compare different hand types - bomb beats single', () => {
      const singleCards = [new Card(Suit.Hearts, Rank.Ace)];
      const singleResult = GuanDanHandAnalyzer.analyze(singleCards);

      const bombCards = [
        new Card(Suit.Hearts, Rank.Ten),
        new Card(Suit.Diamonds, Rank.Ten),
        new Card(Suit.Clubs, Rank.Ten),
        new Card(Suit.Spades, Rank.Ten)
      ];
      const bombResult = GuanDanHandAnalyzer.analyze(bombCards);

      expect(singleResult).not.toBeNull();
      expect(bombResult).not.toBeNull();

      if (singleResult && bombResult) {
        expect(GuanDanHandAnalyzer.compare(bombResult, singleResult)).toBe(true);
        expect(GuanDanHandAnalyzer.compare(singleResult, bombResult)).toBe(false);
      }
    });

    it('should compare same hand types by rank', () => {
      const lowSingleCards = [new Card(Suit.Hearts, Rank.Ten)];
      const lowSingleResult = GuanDanHandAnalyzer.analyze(lowSingleCards);

      const highSingleCards = [new Card(Suit.Hearts, Rank.Ace)];
      const highSingleResult = GuanDanHandAnalyzer.analyze(highSingleCards);

      expect(lowSingleResult).not.toBeNull();
      expect(highSingleResult).not.toBeNull();

      if (lowSingleResult && highSingleResult) {
        expect(GuanDanHandAnalyzer.compare(highSingleResult, lowSingleResult)).toBe(true);
        expect(GuanDanHandAnalyzer.compare(lowSingleResult, highSingleResult)).toBe(false);
      }
    });

    it('should compare bombs by size and rank', () => {
      const smallBombCards = [
        new Card(Suit.Hearts, Rank.Ten),
        new Card(Suit.Diamonds, Rank.Ten),
        new Card(Suit.Clubs, Rank.Ten),
        new Card(Suit.Spades, Rank.Ten)
      ];
      const smallBombResult = GuanDanHandAnalyzer.analyze(smallBombCards);

      const bigBombCards = [
        new Card(Suit.Hearts, Rank.Ace),
        new Card(Suit.Diamonds, Rank.Ace),
        new Card(Suit.Clubs, Rank.Ace),
        new Card(Suit.Spades, Rank.Ace)
      ];
      const bigBombResult = GuanDanHandAnalyzer.analyze(bigBombCards);

      expect(smallBombResult).not.toBeNull();
      expect(bigBombResult).not.toBeNull();

      if (smallBombResult && bigBombResult) {
        expect(GuanDanHandAnalyzer.compare(bigBombResult, smallBombResult)).toBe(true);
      }
    });
  });
});

describe('GuanDanGame', () => {
  describe('game initialization', () => {
    it('should create a game with 4 players', () => {
      const game = new GuanDanGame();
      const players = game.getPlayers();
      expect(players.length).toBe(4);
      expect(players[0].id).toBe(0);
      expect(players[1].id).toBe(1);
      expect(players[2].id).toBe(2);
      expect(players[3].id).toBe(3);
    });

    it('should assign teams correctly', () => {
      const game = new GuanDanGame();
      const players = game.getPlayers();
      expect(players[0].team).toBe('teamA');
      expect(players[1].team).toBe('teamB');
      expect(players[2].team).toBe('teamA');
      expect(players[3].team).toBe('teamB');
    });

    it('should start in waiting state', () => {
      const game = new GuanDanGame();
      expect(game.getGameState()).toBe('waiting');
    });
  });

  describe('game flow', () => {
    it('should deal cards when starting game', () => {
      const game = new GuanDanGame();
      game.startGame();
      const players = game.getPlayers();
      
      expect(players[0].cards.length).toBe(27);
      expect(players[1].cards.length).toBe(27);
      expect(players[2].cards.length).toBe(27);
      expect(players[3].cards.length).toBe(27);
    });

    it('should have current player after start', () => {
      const game = new GuanDanGame();
      game.startGame();
      
      const currentPlayerId = game.getCurrentPlayerId();
      expect(currentPlayerId).toBeGreaterThanOrEqual(0);
      expect(currentPlayerId).toBeLessThan(4);
    });

    it('should start in playing state', () => {
      const game = new GuanDanGame();
      game.startGame();
      
      expect(game.getGameState()).toBe('playing');
    });

    it('should allow playing valid cards', () => {
      const game = new GuanDanGame();
      game.startGame();
      
      const playerId = game.getCurrentPlayerId();
      const players = game.getPlayers();
      const player = players[playerId];
      
      if (player.cards.length > 0) {
        const cardToPlay = [player.cards[0]];
        const result = game.play({ playerId, cards: cardToPlay });
        expect(result).toBe(true);
      }
    });

    it('should not allow invalid player to play', () => {
      const game = new GuanDanGame();
      game.startGame();
      
      const currentPlayerId = game.getCurrentPlayerId();
      const invalidPlayerId = (currentPlayerId + 1) % 4;
      
      const result = game.play({ 
        playerId: invalidPlayerId, 
        cards: [new Card(Suit.Hearts, Rank.Ace)] 
      });
      
      expect(result).toBe(false);
    });
  });
});
