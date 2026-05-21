import { Card, Rank } from './Card';
import { HandType, HandResult, DouDiZhuHandAnalyzer } from './DouDiZhu';

export class AIHandGenerator {
  static generateAllPossibleHands(cards: Card[]): HandResult[] {
    const results: HandResult[] = [];
    const sortedCards = [...cards].sort((a, b) => a.compareTo(b));
    const rankCounts = this.getRankCounts(sortedCards);

    this.generateSingles(results, sortedCards);
    this.generatePairs(results, sortedCards, rankCounts);
    this.generateTriples(results, sortedCards, rankCounts);
    this.generateTripleWithOne(results, sortedCards, rankCounts);
    this.generateTripleWithTwo(results, sortedCards, rankCounts);
    this.generateStraights(results, sortedCards, rankCounts);
    this.generateDoubleStraights(results, sortedCards, rankCounts);
    this.generateBombs(results, sortedCards, rankCounts);
    this.generateQuadrupleWithTwo(results, sortedCards, rankCounts);
    this.generateRocket(results, sortedCards);
    this.generateAirplanes(results, sortedCards, rankCounts);

    return results;
  }

  static generateValidPlayHands(cards: Card[], lastPlay: HandResult | null): HandResult[] {
    const allHands = this.generateAllPossibleHands(cards);
    if (!lastPlay) {
      return allHands;
    }
    return allHands.filter(hand => DouDiZhuHandAnalyzer.compare(hand, lastPlay));
  }

  private static getRankCounts(cards: Card[]): Map<Rank, Card[]> {
    const counts = new Map<Rank, Card[]>();
    for (const card of cards) {
      if (!card.isJoker()) {
        const existing = counts.get(card.rank) || [];
        existing.push(card);
        counts.set(card.rank, existing);
      }
    }
    return counts;
  }

  private static generateSingles(results: HandResult[], cards: Card[]): void {
    for (const card of cards) {
      const hand = DouDiZhuHandAnalyzer.analyze([card]);
      if (hand) results.push(hand);
    }
  }

  private static generatePairs(results: HandResult[], cards: Card[], rankCounts: Map<Rank, Card[]>): void {
    for (const [rank, rankCards] of rankCounts) {
      if (rankCards.length >= 2) {
        for (let i = 0; i < rankCards.length - 1; i++) {
          for (let j = i + 1; j < rankCards.length; j++) {
            const hand = DouDiZhuHandAnalyzer.analyze([rankCards[i], rankCards[j]]);
            if (hand) results.push(hand);
          }
        }
      }
    }
  }

  private static generateTriples(results: HandResult[], cards: Card[], rankCounts: Map<Rank, Card[]>): void {
    for (const [rank, rankCards] of rankCounts) {
      if (rankCards.length >= 3) {
        const combinations = this.getCombinations(rankCards, 3);
        for (const combo of combinations) {
          const hand = DouDiZhuHandAnalyzer.analyze(combo);
          if (hand) results.push(hand);
        }
      }
    }
  }

  private static generateTripleWithOne(results: HandResult[], cards: Card[], rankCounts: Map<Rank, Card[]>): void {
    for (const [tripleRank, tripleCards] of rankCounts) {
      if (tripleCards.length >= 3) {
        const tripleCombinations = this.getCombinations(tripleCards, 3);
        for (const tripleCombo of tripleCombinations) {
          for (const card of cards) {
            if (card.rank !== tripleRank && !card.isJoker() || card.isJoker()) {
              const hand = DouDiZhuHandAnalyzer.analyze([...tripleCombo, card]);
              if (hand) results.push(hand);
            }
          }
        }
      }
    }
  }

  private static generateTripleWithTwo(results: HandResult[], cards: Card[], rankCounts: Map<Rank, Card[]>): void {
    for (const [tripleRank, tripleCards] of rankCounts) {
      if (tripleCards.length >= 3) {
        const tripleCombinations = this.getCombinations(tripleCards, 3);
        for (const tripleCombo of tripleCombinations) {
          for (const [pairRank, pairCards] of rankCounts) {
            if (pairRank !== tripleRank && pairCards.length >= 2) {
              const pairCombinations = this.getCombinations(pairCards, 2);
              for (const pairCombo of pairCombinations) {
                const hand = DouDiZhuHandAnalyzer.analyze([...tripleCombo, ...pairCombo]);
                if (hand) results.push(hand);
              }
            }
          }
        }
      }
    }
  }

  private static generateStraights(results: HandResult[], cards: Card[], rankCounts: Map<Rank, Card[]>): void {
    const ranks = Array.from(rankCounts.keys()).filter(r => r < Rank.Two).sort((a, b) => a - b);
    
    for (let start = 0; start < ranks.length; start++) {
      for (let end = start + 4; end < ranks.length; end++) {
        let consecutive = true;
        for (let i = start + 1; i <= end; i++) {
          if (ranks[i] !== ranks[i - 1] + 1) {
            consecutive = false;
            break;
          }
        }
        if (consecutive) {
          const selectedRanks = ranks.slice(start, end + 1);
          const cardsByRank: Card[][] = [];
          for (const r of selectedRanks) {
            cardsByRank.push(rankCounts.get(r)!);
          }
          const combinations = this.getCartesianProduct(cardsByRank);
          for (const combo of combinations) {
            const hand = DouDiZhuHandAnalyzer.analyze(combo);
            if (hand) results.push(hand);
          }
        }
      }
    }
  }

  private static generateDoubleStraights(results: HandResult[], cards: Card[], rankCounts: Map<Rank, Card[]>): void {
    const ranks = Array.from(rankCounts.keys()).filter(r => r < Rank.Two && rankCounts.get(r)!.length >= 2).sort((a, b) => a - b);
    
    for (let start = 0; start < ranks.length; start++) {
      for (let end = start + 2; end < ranks.length; end++) {
        let consecutive = true;
        for (let i = start + 1; i <= end; i++) {
          if (ranks[i] !== ranks[i - 1] + 1) {
            consecutive = false;
            break;
          }
        }
        if (consecutive) {
          const selectedRanks = ranks.slice(start, end + 1);
          const pairsByRank: Card[][][] = [];
          for (const r of selectedRanks) {
            pairsByRank.push(this.getCombinations(rankCounts.get(r)!, 2));
          }
          const combinations = this.getCartesianProduct(pairsByRank);
          for (const combo of combinations) {
            const hand = DouDiZhuHandAnalyzer.analyze(combo.flat());
            if (hand) results.push(hand);
          }
        }
      }
    }
  }

  private static generateBombs(results: HandResult[], cards: Card[], rankCounts: Map<Rank, Card[]>): void {
    for (const [rank, rankCards] of rankCounts) {
      if (rankCards.length >= 4) {
        const hand = DouDiZhuHandAnalyzer.analyze(rankCards);
        if (hand) results.push(hand);
      }
    }
  }

  private static generateQuadrupleWithTwo(results: HandResult[], cards: Card[], rankCounts: Map<Rank, Card[]>): void {
    for (const [quadRank, quadCards] of rankCounts) {
      if (quadCards.length >= 4) {
        for (const [rank1, cards1] of rankCounts) {
          if (rank1 !== quadRank) {
            for (const [rank2, cards2] of rankCounts) {
              if (rank2 !== quadRank && rank2 >= rank1) {
                for (const c1 of cards1) {
                  for (const c2 of cards2) {
                    if (rank1 === rank2 && cards1.indexOf(c1) >= cards1.indexOf(c2)) continue;
                    const hand = DouDiZhuHandAnalyzer.analyze([...quadCards, c1, c2]);
                    if (hand) results.push(hand);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  private static generateRocket(results: HandResult[], cards: Card[]): void {
    const smallJoker = cards.find(c => c.isSmallJoker());
    const bigJoker = cards.find(c => c.isBigJoker());
    if (smallJoker && bigJoker) {
      const hand = DouDiZhuHandAnalyzer.analyze([smallJoker, bigJoker]);
      if (hand) results.push(hand);
    }
  }

  private static generateAirplanes(results: HandResult[], cards: Card[], rankCounts: Map<Rank, Card[]>): void {
    const tripleRanks = Array.from(rankCounts.keys()).filter(r => rankCounts.get(r)!.length >= 3).sort((a, b) => a - b);
    
    for (let start = 0; start < tripleRanks.length; start++) {
      for (let end = start + 1; end < tripleRanks.length; end++) {
        let consecutive = true;
        for (let i = start + 1; i <= end; i++) {
          if (tripleRanks[i] !== tripleRanks[i - 1] + 1) {
            consecutive = false;
            break;
          }
        }
        if (consecutive) {
          const selectedTripleRanks = tripleRanks.slice(start, end + 1);
          const tripleCombinations: Card[][][] = [];
          for (const r of selectedTripleRanks) {
            tripleCombinations.push(this.getCombinations(rankCounts.get(r)!, 3));
          }
          const planeCombinations = this.getCartesianProduct(tripleCombinations);
          
          for (const plane of planeCombinations) {
            const planeCards = plane.flat();
            const hand1 = DouDiZhuHandAnalyzer.analyze(planeCards);
            if (hand1) results.push(hand1);
            
            const remainingRanks = Array.from(rankCounts.keys()).filter(r => !selectedTripleRanks.includes(r));
            
            const singleCandidates: Card[] = [];
            for (const r of remainingRanks) {
              singleCandidates.push(...rankCounts.get(r)!);
            }
            const jokers = cards.filter(c => c.isJoker());
            singleCandidates.push(...jokers);
            
            if (singleCandidates.length >= selectedTripleRanks.length) {
              const singleCombos = this.getCombinations(singleCandidates, selectedTripleRanks.length);
              for (const singles of singleCombos) {
                const hand2 = DouDiZhuHandAnalyzer.analyze([...planeCards, ...singles]);
                if (hand2) results.push(hand2);
              }
            }
            
            const pairCandidates: Card[][] = [];
            for (const r of remainingRanks) {
              if (rankCounts.get(r)!.length >= 2) {
                pairCandidates.push(...this.getCombinations(rankCounts.get(r)!, 2));
              }
            }
            
            if (pairCandidates.length >= selectedTripleRanks.length) {
              for (let i = 0; i <= pairCandidates.length - selectedTripleRanks.length; i++) {
                const pairs = pairCandidates.slice(i, i + selectedTripleRanks.length);
                const hand3 = DouDiZhuHandAnalyzer.analyze([...planeCards, ...pairs.flat()]);
                if (hand3) results.push(hand3);
              }
            }
          }
        }
      }
    }
  }

  private static getCombinations<T>(arr: T[], k: number): T[][] {
    const result: T[][] = [];
    const backtrack = (start: number, current: T[]) => {
      if (current.length === k) {
        result.push([...current]);
        return;
      }
      for (let i = start; i < arr.length; i++) {
        current.push(arr[i]);
        backtrack(i + 1, current);
        current.pop();
      }
    };
    backtrack(0, []);
    return result;
  }

  private static getCartesianProduct<T>(arrays: T[][]): T[][] {
    return arrays.reduce((a, b) => {
      return a.flatMap(x => b.map(y => [...x, y]));
    }, [[]] as T[][]);
  }
}
