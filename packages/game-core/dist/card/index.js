import { Suit, Rank } from '../types';
export class CardUtil {
    static createCard(suit, rank) {
        return {
            suit,
            rank,
            id: `${suit}_${rank}`
        };
    }
    static createStandardDeck(includeJokers = true) {
        const deck = [];
        const suits = [Suit.SPADE, Suit.HEART, Suit.CLUB, Suit.DIAMOND];
        const ranks = [
            Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX, Rank.SEVEN,
            Rank.EIGHT, Rank.NINE, Rank.TEN, Rank.J, Rank.Q, Rank.K,
            Rank.A, Rank.TWO
        ];
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push(this.createCard(suit, rank));
            }
        }
        if (includeJokers) {
            deck.push(this.createCard(Suit.BLACK_JOKER, Rank.BLACK_JOKER));
            deck.push(this.createCard(Suit.RED_JOKER, Rank.RED_JOKER));
        }
        return deck;
    }
    static createGuanDanDeck() {
        const deck = [];
        const suits = [Suit.SPADE, Suit.HEART, Suit.CLUB, Suit.DIAMOND];
        const ranks = [
            Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX, Rank.SEVEN,
            Rank.EIGHT, Rank.NINE, Rank.TEN, Rank.J, Rank.Q, Rank.K,
            Rank.A, Rank.TWO
        ];
        for (let i = 0; i < 2; i++) {
            for (const suit of suits) {
                for (const rank of ranks) {
                    deck.push(this.createCard(suit, rank));
                }
            }
            deck.push(this.createCard(Suit.BLACK_JOKER, Rank.BLACK_JOKER));
            deck.push(this.createCard(Suit.RED_JOKER, Rank.RED_JOKER));
        }
        return deck;
    }
    static sortCards(cards, ascending = true) {
        return [...cards].sort((a, b) => {
            if (ascending) {
                return a.rank - b.rank;
            }
            return b.rank - a.rank;
        });
    }
    static getCardsByRank(cards) {
        const map = new Map();
        for (const card of cards) {
            if (!map.has(card.rank)) {
                map.set(card.rank, []);
            }
            map.get(card.rank).push(card);
        }
        return map;
    }
    static getRankCounts(cards) {
        const counts = new Map();
        for (const card of cards) {
            counts.set(card.rank, (counts.get(card.rank) || 0) + 1);
        }
        return counts;
    }
    static isJoker(card) {
        return card.suit === Suit.BLACK_JOKER || card.suit === Suit.RED_JOKER;
    }
    static hasJoker(cards) {
        return cards.some(card => this.isJoker(card));
    }
}
//# sourceMappingURL=index.js.map