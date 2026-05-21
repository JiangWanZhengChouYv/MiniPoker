import { describe, it, expect } from 'vitest';
import { Card, Suit, Rank } from './Card';
import { HandType, HandResult, DouDiZhuHandAnalyzer, PlayerRole } from './DouDiZhu';
import { AIHandGenerator } from './AIHandGenerator';
import { SimpleDouDiZhuAI } from './SimpleDouDiZhuAI';
import { AIDecisionContext } from './AIDecision';

describe('AIHandGenerator', () => {
  describe('generateAllPossibleHands', () => {
    it('should generate single cards', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Four)
      ];
      const hands = AIHandGenerator.generateAllPossibleHands(cards);
      expect(hands.some(h => h.type === HandType.Single)).toBe(true);
    });

    it('should generate pairs', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three)
      ];
      const hands = AIHandGenerator.generateAllPossibleHands(cards);
      expect(hands.some(h => h.type === HandType.Pair)).toBe(true);
    });

    it('should generate bombs', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Three),
        new Card(Suit.Clubs, Rank.Three)
      ];
      const hands = AIHandGenerator.generateAllPossibleHands(cards);
      expect(hands.some(h => h.type === HandType.Bomb)).toBe(true);
    });

    it('should generate rocket', () => {
      const cards = [
        Card.createSmallJoker(),
        Card.createBigJoker()
      ];
      const hands = AIHandGenerator.generateAllPossibleHands(cards);
      expect(hands.some(h => h.type === HandType.Rocket)).toBe(true);
    });

    it('should generate straights', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Four),
        new Card(Suit.Diamonds, Rank.Five),
        new Card(Suit.Clubs, Rank.Six),
        new Card(Suit.Spades, Rank.Seven)
      ];
      const hands = AIHandGenerator.generateAllPossibleHands(cards);
      expect(hands.some(h => h.type === HandType.Straight)).toBe(true);
    });
  });

  describe('generateValidPlayHands', () => {
    it('should generate all possible hands when no last play', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three)
      ];
      const hands = AIHandGenerator.generateValidPlayHands(cards, null);
      expect(hands.length).toBeGreaterThan(0);
    });

    it('should generate only hands that can beat the last play', () => {
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Four),
        new Card(Suit.Diamonds, Rank.Five)
      ];
      
      const lastPlayCard = new Card(Suit.Clubs, Rank.Three);
      const lastPlay = DouDiZhuHandAnalyzer.analyze([lastPlayCard])!;
      
      const hands = AIHandGenerator.generateValidPlayHands(cards, lastPlay);
      expect(hands.every(h => h.type === HandType.Single && h.mainRank > Rank.Three)).toBe(true);
    });
  });
});

describe('SimpleDouDiZhuAI', () => {
  describe('decide', () => {
    it('should return shouldPlay false when no valid hands', () => {
      const ai = new SimpleDouDiZhuAI();
      const cards = [new Card(Suit.Spades, Rank.Three)];
      const lastPlayCard = new Card(Suit.Hearts, Rank.Four);
      const lastPlay = DouDiZhuHandAnalyzer.analyze([lastPlayCard])!;
      
      const context: AIDecisionContext = {
        playerId: 1,
        handCards: cards,
        lastPlay,
        lastPlayerId: 0,
        role: PlayerRole.Farmer,
        players: [
          { id: 0, cardCount: 17, role: PlayerRole.Landlord },
          { id: 1, cardCount: 17, role: PlayerRole.Farmer },
          { id: 2, cardCount: 17, role: PlayerRole.Farmer }
        ]
      };
      
      const decision = ai.decide(context);
      expect(decision.shouldPlay).toBe(false);
    });

    it('should return shouldPlay true when there are valid hands', () => {
      const ai = new SimpleDouDiZhuAI();
      const cards = [new Card(Suit.Spades, Rank.Five)];
      
      const context: AIDecisionContext = {
        playerId: 1,
        handCards: cards,
        lastPlay: null,
        lastPlayerId: null,
        role: PlayerRole.Farmer,
        players: [
          { id: 0, cardCount: 17, role: PlayerRole.Landlord },
          { id: 1, cardCount: 17, role: PlayerRole.Farmer },
          { id: 2, cardCount: 17, role: PlayerRole.Farmer }
        ]
      };
      
      const decision = ai.decide(context);
      expect(decision.shouldPlay).toBe(true);
      expect(decision.cards.length).toBe(1);
    });

    it('should select smallest hand when playing first', () => {
      const ai = new SimpleDouDiZhuAI();
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Four),
        new Card(Suit.Diamonds, Rank.Five)
      ];
      
      const context: AIDecisionContext = {
        playerId: 1,
        handCards: cards,
        lastPlay: null,
        lastPlayerId: null,
        role: PlayerRole.Farmer,
        players: [
          { id: 0, cardCount: 17, role: PlayerRole.Landlord },
          { id: 1, cardCount: 17, role: PlayerRole.Farmer },
          { id: 2, cardCount: 17, role: PlayerRole.Farmer }
        ]
      };
      
      const decision = ai.decide(context);
      expect(decision.cards.length).toBe(1);
      expect(decision.cards[0].rank).toBe(Rank.Three);
    });

    it('should use bomb when necessary', () => {
      const ai = new SimpleDouDiZhuAI();
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Three),
        new Card(Suit.Diamonds, Rank.Three),
        new Card(Suit.Clubs, Rank.Three),
        new Card(Suit.Spades, Rank.Four)
      ];
      
      const lastPlayCards = [
        new Card(Suit.Spades, Rank.King),
        new Card(Suit.Hearts, Rank.King),
        new Card(Suit.Diamonds, Rank.King)
      ];
      const lastPlay = DouDiZhuHandAnalyzer.analyze(lastPlayCards)!;
      
      const context: AIDecisionContext = {
        playerId: 1,
        handCards: cards,
        lastPlay,
        lastPlayerId: 0,
        role: PlayerRole.Farmer,
        players: [
          { id: 0, cardCount: 4, role: PlayerRole.Landlord },
          { id: 1, cardCount: 5, role: PlayerRole.Farmer },
          { id: 2, cardCount: 10, role: PlayerRole.Farmer }
        ]
      };
      
      const decision = ai.decide(context);
      expect(decision.shouldPlay).toBe(true);
    });
  });

  describe('decideBid', () => {
    it('should return 0 when hand is weak', () => {
      const ai = new SimpleDouDiZhuAI();
      const cards = [
        new Card(Suit.Spades, Rank.Three),
        new Card(Suit.Hearts, Rank.Four),
        new Card(Suit.Diamonds, Rank.Five)
      ];
      
      const context: AIDecisionContext = {
        playerId: 1,
        handCards: cards,
        lastPlay: null,
        lastPlayerId: null,
        role: PlayerRole.Farmer,
        players: []
      };
      
      const bid = ai.decideBid(context, 0);
      expect(bid).toBe(0);
    });

    it('should return higher bid when hand is strong', () => {
      const ai = new SimpleDouDiZhuAI();
      const cards = [
        Card.createBigJoker(),
        Card.createSmallJoker(),
        new Card(Suit.Spades, Rank.Two),
        new Card(Suit.Hearts, Rank.Two),
        new Card(Suit.Diamonds, Rank.Two),
        new Card(Suit.Clubs, Rank.Two)
      ];
      
      const context: AIDecisionContext = {
        playerId: 1,
        handCards: cards,
        lastPlay: null,
        lastPlayerId: null,
        role: PlayerRole.Farmer,
        players: []
      };
      
      const bid = ai.decideBid(context, 0);
      expect(bid).toBeGreaterThan(0);
    });
  });
});
