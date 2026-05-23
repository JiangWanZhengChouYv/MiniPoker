import { Card, HandResult, HandType } from '../types';
import { CardUtil } from '../card';
import { HandUtil } from '../hand';
import { DouDiZhuGame } from '../games/doudizhu';
import { GuanDanGame } from '../games/guandan';
import { ZhaJinHuaGame, ZhaJinHuaHandResult } from '../games/zhaojinhua';

export class SimpleAI {
  static makeDouDiZhuMove(game: DouDiZhuGame, playerId: string): { action: 'play' | 'pass', cards?: Card[] } {
    const player = game.getPlayer(playerId);
    if (!player) {
      return { action: 'pass' };
    }

    const lastHand = game.getLastPlayedHand();

    if (!lastHand) {
      return this.findSmallestValidHand(player.cards);
    }

    const beatingHand = this.findBeatingHand(player.cards, lastHand);
    if (beatingHand) {
      return { action: 'play', cards: beatingHand.cards };
    }

    return { action: 'pass' };
  }

  static makeGuanDanMove(game: GuanDanGame, playerId: string): { action: 'play' | 'pass', cards?: Card[] } {
    const player = game.getPlayer(playerId);
    if (!player) {
      return { action: 'pass' };
    }

    const lastHand = game.getLastPlayedHand();

    if (!lastHand) {
      return this.findSmallestValidHand(player.cards);
    }

    const beatingHand = this.findBeatingHand(player.cards, lastHand);
    if (beatingHand) {
      return { action: 'play', cards: beatingHand.cards };
    }

    return { action: 'pass' };
  }

  static makeZhaJinHuaMove(game: ZhaJinHuaGame, playerId: string): { action: 'call' | 'raise' | 'fold', raiseAmount?: number } {
    const player = game.getPlayer(playerId);
    if (!player) {
      return { action: 'fold' };
    }

    const handResult = ZhaJinHuaGame.checkHand(player.cards);
    const currentBet = game.getCurrentBet();
    const pot = game.getPot();

    if (handResult.type >= 3) {
      if (Math.random() > 0.3) {
        return { action: 'raise', raiseAmount: currentBet };
      }
      return { action: 'call' };
    }

    if (handResult.type === 2) {
      if (handResult.mainRank >= 10) {
        return { action: 'call' };
      }
      return { action: 'fold' };
    }

    if (handResult.type === 1) {
      if (handResult.mainRank >= 12) {
        return { action: 'call' };
      }
      if (Math.random() < 0.2) {
        return { action: 'call' };
      }
      return { action: 'fold' };
    }

    return { action: 'fold' };
  }

  private static findSmallestValidHand(cards: Card[]): { action: 'play' | 'pass', cards?: Card[] } {
    const sortedCards = CardUtil.sortCards(cards, true);

    const singleResult = HandUtil.isSingle([sortedCards[0]]);
    if (singleResult.isValid) {
      return { action: 'play', cards: [sortedCards[0]] };
    }

    const pairResult = this.findSmallestPair(sortedCards);
    if (pairResult) {
      return { action: 'play', cards: pairResult };
    }

    const tripleResult = this.findSmallestTriple(sortedCards);
    if (tripleResult) {
      return { action: 'play', cards: tripleResult };
    }

    if (cards.length > 0) {
      return { action: 'play', cards: [sortedCards[0]] };
    }

    return { action: 'pass' };
  }

  private static findSmallestPair(cards: Card[]): Card[] | null {
    const sortedCards = CardUtil.sortCards(cards, true);
    for (let i = 0; i < sortedCards.length - 1; i++) {
      if (sortedCards[i].rank === sortedCards[i + 1].rank) {
        return [sortedCards[i], sortedCards[i + 1]];
      }
    }
    return null;
  }

  private static findSmallestTriple(cards: Card[]): Card[] | null {
    const sortedCards = CardUtil.sortCards(cards, true);
    for (let i = 0; i < sortedCards.length - 2; i++) {
      if (sortedCards[i].rank === sortedCards[i + 1].rank && sortedCards[i + 1].rank === sortedCards[i + 2].rank) {
        return [sortedCards[i], sortedCards[i + 1], sortedCards[i + 2]];
      }
    }
    return null;
  }

  private static findBeatingHand(cards: Card[], lastHand: HandResult): HandResult | null {
    const sortedCards = CardUtil.sortCards(cards, true);

    const possibleHands = this.generateAllPossibleHands(sortedCards);

    let bestHand: HandResult | null = null;
    for (const hand of possibleHands) {
      if (hand.type === lastHand.type || hand.type === HandType.BOMB || hand.type === HandType.ROCKET) {
        if (HandUtil.compareHand(hand, lastHand) > 0) {
          if (!bestHand || HandUtil.compareHand(hand, bestHand) < 0) {
            bestHand = hand;
          }
        }
      }
    }

    return bestHand;
  }

  private static generateAllPossibleHands(cards: Card[]): HandResult[] {
    const hands: HandResult[] = [];

    for (const card of cards) {
      const result = HandUtil.isSingle([card]);
      if (result.isValid) {
        hands.push(result);
      }
    }

    for (let i = 0; i < cards.length - 1; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const result = HandUtil.isPair([cards[i], cards[j]]);
        if (result.isValid) {
          hands.push(result);
        }
      }
    }

    for (let i = 0; i < cards.length - 2; i++) {
      for (let j = i + 1; j < cards.length - 1; j++) {
        for (let k = j + 1; k < cards.length; k++) {
          const result = HandUtil.isTriple([cards[i], cards[j], cards[k]]);
          if (result.isValid) {
            hands.push(result);
          }
        }
      }
    }

    for (let i = 0; i < cards.length - 3; i++) {
      for (let j = i + 1; j < cards.length - 2; j++) {
        for (let k = j + 1; k < cards.length - 1; k++) {
          for (let l = k + 1; l < cards.length; l++) {
            const result = HandUtil.isBomb([cards[i], cards[j], cards[k], cards[l]]);
            if (result.isValid) {
              hands.push(result);
            }
          }
        }
      }
    }

    return hands;
  }
}
