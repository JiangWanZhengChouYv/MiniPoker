import { Card, HandResult } from '../types';
export declare class HandUtil {
    static isSingle(cards: Card[]): HandResult;
    static isPair(cards: Card[]): HandResult;
    static isTriple(cards: Card[]): HandResult;
    static isTripleOne(cards: Card[]): HandResult;
    static isTripleTwo(cards: Card[]): HandResult;
    static isStraight(cards: Card[], minLength?: number): HandResult;
    static isStraightPair(cards: Card[], minLength?: number): HandResult;
    static isPlane(cards: Card[], minLength?: number): HandResult;
    static isBomb(cards: Card[]): HandResult;
    static isRocket(cards: Card[]): HandResult;
    static compareHand(hand1: HandResult, hand2: HandResult): number;
}
//# sourceMappingURL=index.d.ts.map