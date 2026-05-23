import { Suit, Rank, Card } from '../types';
export declare class CardUtil {
    static createCard(suit: Suit, rank: Rank): Card;
    static createStandardDeck(includeJokers?: boolean): Card[];
    static createGuanDanDeck(): Card[];
    static sortCards(cards: Card[], ascending?: boolean): Card[];
    static getCardsByRank(cards: Card[]): Map<Rank, Card[]>;
    static getRankCounts(cards: Card[]): Map<Rank, number>;
    static isJoker(card: Card): boolean;
    static hasJoker(cards: Card[]): boolean;
}
//# sourceMappingURL=index.d.ts.map