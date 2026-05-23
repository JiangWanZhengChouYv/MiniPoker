import { HandType, Rank, Suit } from '../types';
import { CardUtil } from '../card';
export class HandUtil {
    static isSingle(cards) {
        if (cards.length !== 1) {
            return { type: HandType.SINGLE, mainRank: 0, cards, isValid: false };
        }
        return {
            type: HandType.SINGLE,
            mainRank: cards[0].rank,
            cards: CardUtil.sortCards(cards),
            isValid: true
        };
    }
    static isPair(cards) {
        if (cards.length !== 2 || cards[0].rank !== cards[1].rank) {
            return { type: HandType.PAIR, mainRank: 0, cards, isValid: false };
        }
        return {
            type: HandType.PAIR,
            mainRank: cards[0].rank,
            cards: CardUtil.sortCards(cards),
            isValid: true
        };
    }
    static isTriple(cards) {
        if (cards.length !== 3 || cards[0].rank !== cards[1].rank || cards[1].rank !== cards[2].rank) {
            return { type: HandType.TRIPLE, mainRank: 0, cards, isValid: false };
        }
        return {
            type: HandType.TRIPLE,
            mainRank: cards[0].rank,
            cards: CardUtil.sortCards(cards),
            isValid: true
        };
    }
    static isTripleOne(cards) {
        if (cards.length !== 4) {
            return { type: HandType.TRIPLE_ONE, mainRank: 0, cards, isValid: false };
        }
        const rankCounts = CardUtil.getRankCounts(cards);
        let tripleRank = 0;
        let singleRank = 0;
        for (const [rank, count] of rankCounts) {
            if (count === 3) {
                tripleRank = rank;
            }
            else if (count === 1) {
                singleRank = rank;
            }
            else {
                return { type: HandType.TRIPLE_ONE, mainRank: 0, cards, isValid: false };
            }
        }
        if (tripleRank === 0) {
            return { type: HandType.TRIPLE_ONE, mainRank: 0, cards, isValid: false };
        }
        return {
            type: HandType.TRIPLE_ONE,
            mainRank: tripleRank,
            subRank: singleRank,
            cards: CardUtil.sortCards(cards),
            isValid: true
        };
    }
    static isTripleTwo(cards) {
        if (cards.length !== 5) {
            return { type: HandType.TRIPLE_TWO, mainRank: 0, cards, isValid: false };
        }
        const rankCounts = CardUtil.getRankCounts(cards);
        let tripleRank = 0;
        let pairRank = 0;
        for (const [rank, count] of rankCounts) {
            if (count === 3) {
                tripleRank = rank;
            }
            else if (count === 2) {
                pairRank = rank;
            }
            else {
                return { type: HandType.TRIPLE_TWO, mainRank: 0, cards, isValid: false };
            }
        }
        if (tripleRank === 0 || pairRank === 0) {
            return { type: HandType.TRIPLE_TWO, mainRank: 0, cards, isValid: false };
        }
        return {
            type: HandType.TRIPLE_TWO,
            mainRank: tripleRank,
            subRank: pairRank,
            cards: CardUtil.sortCards(cards),
            isValid: true
        };
    }
    static isStraight(cards, minLength = 5) {
        if (cards.length < minLength) {
            return { type: HandType.STRAIGHT, mainRank: 0, cards, isValid: false };
        }
        const sortedCards = CardUtil.sortCards(cards);
        for (let i = 0; i < sortedCards.length - 1; i++) {
            if (sortedCards[i + 1].rank - sortedCards[i].rank !== 1) {
                return { type: HandType.STRAIGHT, mainRank: 0, cards, isValid: false };
            }
        }
        for (const card of sortedCards) {
            if (CardUtil.isJoker(card) || card.rank === Rank.TWO) {
                return { type: HandType.STRAIGHT, mainRank: 0, cards, isValid: false };
            }
        }
        return {
            type: HandType.STRAIGHT,
            mainRank: sortedCards[sortedCards.length - 1].rank,
            cards: sortedCards,
            isValid: true
        };
    }
    static isStraightPair(cards, minLength = 3) {
        if (cards.length < minLength * 2 || cards.length % 2 !== 0) {
            return { type: HandType.STRAIGHT_PAIR, mainRank: 0, cards, isValid: false };
        }
        const sortedCards = CardUtil.sortCards(cards);
        const rankCounts = CardUtil.getRankCounts(sortedCards);
        const ranks = Array.from(rankCounts.keys()).sort((a, b) => a - b);
        for (const count of rankCounts.values()) {
            if (count !== 2) {
                return { type: HandType.STRAIGHT_PAIR, mainRank: 0, cards, isValid: false };
            }
        }
        for (let i = 0; i < ranks.length - 1; i++) {
            if (ranks[i + 1] - ranks[i] !== 1) {
                return { type: HandType.STRAIGHT_PAIR, mainRank: 0, cards, isValid: false };
            }
        }
        for (const rank of ranks) {
            if (rank === Rank.TWO || rank === Rank.BLACK_JOKER || rank === Rank.RED_JOKER) {
                return { type: HandType.STRAIGHT_PAIR, mainRank: 0, cards, isValid: false };
            }
        }
        return {
            type: HandType.STRAIGHT_PAIR,
            mainRank: ranks[ranks.length - 1],
            cards: sortedCards,
            isValid: true
        };
    }
    static isPlane(cards, minLength = 2) {
        if (cards.length < minLength * 3 || cards.length % 3 !== 0) {
            return { type: HandType.PLANE, mainRank: 0, cards, isValid: false };
        }
        const sortedCards = CardUtil.sortCards(cards);
        const rankCounts = CardUtil.getRankCounts(sortedCards);
        const ranks = Array.from(rankCounts.keys()).sort((a, b) => a - b);
        for (const count of rankCounts.values()) {
            if (count !== 3) {
                return { type: HandType.PLANE, mainRank: 0, cards, isValid: false };
            }
        }
        for (let i = 0; i < ranks.length - 1; i++) {
            if (ranks[i + 1] - ranks[i] !== 1) {
                return { type: HandType.PLANE, mainRank: 0, cards, isValid: false };
            }
        }
        for (const rank of ranks) {
            if (rank === Rank.TWO || rank === Rank.BLACK_JOKER || rank === Rank.RED_JOKER) {
                return { type: HandType.PLANE, mainRank: 0, cards, isValid: false };
            }
        }
        return {
            type: HandType.PLANE,
            mainRank: ranks[ranks.length - 1],
            cards: sortedCards,
            isValid: true
        };
    }
    static isBomb(cards) {
        if (cards.length !== 4 || cards[0].rank !== cards[1].rank ||
            cards[1].rank !== cards[2].rank || cards[2].rank !== cards[3].rank) {
            return { type: HandType.BOMB, mainRank: 0, cards, isValid: false };
        }
        return {
            type: HandType.BOMB,
            mainRank: cards[0].rank,
            cards: CardUtil.sortCards(cards),
            isValid: true
        };
    }
    static isRocket(cards) {
        if (cards.length !== 2) {
            return { type: HandType.ROCKET, mainRank: 0, cards, isValid: false };
        }
        const hasBlackJoker = cards.some(card => card.suit === Suit.BLACK_JOKER);
        const hasRedJoker = cards.some(card => card.suit === Suit.RED_JOKER);
        if (!hasBlackJoker || !hasRedJoker) {
            return { type: HandType.ROCKET, mainRank: 0, cards, isValid: false };
        }
        return {
            type: HandType.ROCKET,
            mainRank: Rank.RED_JOKER,
            cards: CardUtil.sortCards(cards),
            isValid: true
        };
    }
    static compareHand(hand1, hand2) {
        const handTypePriority = {
            [HandType.SINGLE]: 1,
            [HandType.PAIR]: 2,
            [HandType.TRIPLE]: 3,
            [HandType.TRIPLE_ONE]: 4,
            [HandType.TRIPLE_TWO]: 5,
            [HandType.STRAIGHT]: 6,
            [HandType.STRAIGHT_PAIR]: 7,
            [HandType.PLANE]: 8,
            [HandType.PLANE_WITH_SINGLE]: 9,
            [HandType.PLANE_WITH_PAIR]: 10,
            [HandType.FOUR_TWO]: 11,
            [HandType.FOUR_TWO_PAIR]: 12,
            [HandType.BOMB]: 100,
            [HandType.ROCKET]: 101
        };
        if (hand1.type === hand2.type) {
            return hand1.mainRank - hand2.mainRank;
        }
        if (hand1.type === HandType.ROCKET) {
            return 1;
        }
        if (hand2.type === HandType.ROCKET) {
            return -1;
        }
        if (hand1.type === HandType.BOMB && hand2.type !== HandType.BOMB) {
            return 1;
        }
        if (hand2.type === HandType.BOMB && hand1.type !== HandType.BOMB) {
            return -1;
        }
        if (handTypePriority[hand1.type] > handTypePriority[hand2.type]) {
            return 1;
        }
        return -1;
    }
}
//# sourceMappingURL=index.js.map