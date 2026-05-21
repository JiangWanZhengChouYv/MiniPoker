import { Card } from './Card';
import { HandType, HandResult, DouDiZhuHandAnalyzer, PlayerRole } from './DouDiZhu';
import { IAIDecisionMaker, AIDecisionContext, AIDecision } from './AIDecision';
import { AIHandGenerator } from './AIHandGenerator';

export class SimpleDouDiZhuAI implements IAIDecisionMaker {
  decide(context: AIDecisionContext): AIDecision {
    const { handCards, lastPlay } = context;

    if (handCards.length === 0) {
      return { shouldPlay: false, cards: [] };
    }

    const validHands = AIHandGenerator.generateValidPlayHands(handCards, lastPlay);

    if (validHands.length === 0) {
      return { shouldPlay: false, cards: [] };
    }

    const selectedHand = this.selectBestHand(validHands, handCards, lastPlay, context);

    return { shouldPlay: true, cards: selectedHand.cards };
  }

  private selectBestHand(
    validHands: HandResult[],
    handCards: Card[],
    lastPlay: HandResult | null,
    context: AIDecisionContext
  ): HandResult {
    if (!lastPlay) {
      return this.selectFirstPlayHand(validHands, handCards);
    }

    return this.selectFollowUpHand(validHands, handCards, lastPlay);
  }

  private selectFirstPlayHand(validHands: HandResult[], handCards: Card[]): HandResult {
    let candidates = this.filterSmallestHands(validHands);
    
    if (candidates.length === 0) {
      candidates = validHands;
    }

    candidates.sort((a, b) => this.handPriority(b) - this.handPriority(a));
    
    if (candidates.length > 0) {
      return candidates[0];
    }

    return validHands[Math.floor(Math.random() * validHands.length)];
  }

  private selectFollowUpHand(
    validHands: HandResult[],
    handCards: Card[],
    lastPlay: HandResult
  ): HandResult {
    const sameTypeHands = validHands.filter(h => h.type === lastPlay.type && h.length === lastPlay.length);
    
    if (sameTypeHands.length > 0) {
      sameTypeHands.sort((a, b) => a.mainRank - b.mainRank);
      return sameTypeHands[0];
    }

    const bombs = validHands.filter(h => h.type === HandType.Bomb || h.type === HandType.Rocket);
    if (bombs.length > 0) {
      bombs.sort((a, b) => {
        if (a.type === HandType.Rocket) return 1;
        if (b.type === HandType.Rocket) return -1;
        return a.mainRank - b.mainRank;
      });
      const handCardsLeft = handCards.length - bombs[0].cards.length;
      if (handCardsLeft <= 4 || Math.random() > 0.3) {
        return bombs[0];
      }
    }

    validHands.sort((a, b) => a.mainRank - b.mainRank);
    return validHands[0];
  }

  private filterSmallestHands(hands: HandResult[]): HandResult[] {
    const priorities: Record<HandType, number> = {
      [HandType.Single]: 1,
      [HandType.Pair]: 2,
      [HandType.Triple]: 3,
      [HandType.TripleWithOne]: 4,
      [HandType.TripleWithTwo]: 5,
      [HandType.Straight]: 6,
      [HandType.DoubleStraight]: 7,
      [HandType.Airplane]: 8,
      [HandType.QuadrupleWithTwo]: 9,
      [HandType.Bomb]: 10,
      [HandType.Rocket]: 11
    };

    let minPriority = Infinity;
    for (const hand of hands) {
      const priority = priorities[hand.type];
      if (priority < minPriority) {
        minPriority = priority;
      }
    }

    const smallestTypeHands = hands.filter(h => priorities[h.type] === minPriority);
    
    if (smallestTypeHands.length === 0) return [];

    smallestTypeHands.sort((a, b) => a.mainRank - b.mainRank);
    
    return smallestTypeHands;
  }

  private handPriority(hand: HandResult): number {
    let priority = 0;
    
    switch (hand.type) {
      case HandType.Straight:
      case HandType.DoubleStraight:
      case HandType.Airplane:
        priority += 100;
        break;
      case HandType.TripleWithOne:
      case HandType.TripleWithTwo:
        priority += 50;
        break;
    }
    
    priority -= hand.mainRank;
    
    return priority;
  }

  decideBid(context: AIDecisionContext, currentBid: number): number {
    const { handCards } = context;
    
    const cardStrength = this.evaluateHandStrength(handCards);
    
    if (cardStrength > 80 && currentBid < 3) {
      return currentBid + 1;
    } else if (cardStrength > 60 && currentBid < 2) {
      return currentBid + 1;
    } else if (cardStrength > 40 && currentBid < 1) {
      return currentBid + 1;
    }
    
    return 0;
  }

  private evaluateHandStrength(cards: Card[]): number {
    let score = 0;
    
    for (const card of cards) {
      if (card.isBigJoker()) score += 20;
      else if (card.isSmallJoker()) score += 15;
      else if (card.rank === 15) score += 10;
      else if (card.rank === 14) score += 8;
      else if (card.rank === 13) score += 6;
    }
    
    const rankCounts = new Map<number, number>();
    for (const card of cards) {
      if (!card.isJoker()) {
        rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
      }
    }
    
    for (const [rank, count] of rankCounts) {
      if (count === 4) {
        score += 30;
      } else if (count === 3) {
        score += 10;
      }
    }
    
    const hasBigJoker = cards.some(c => c.isBigJoker());
    const hasSmallJoker = cards.some(c => c.isSmallJoker());
    if (hasBigJoker && hasSmallJoker) {
      score += 20;
    }
    
    return Math.min(score, 100);
  }
}
