import { Card } from '../types';
export declare class Deck {
    private cards;
    constructor(cards: Card[]);
    static createStandardDeck(includeJokers?: boolean): Deck;
    static createGuanDanDeck(): Deck;
    shuffle(): void;
    shuffleFisherYates(): void;
    deal(count: number): Card[];
    dealAll(): Card[];
    dealToPlayers(playerCount: number, cardsPerPlayer: number): Card[][];
    getRemainingCount(): number;
    getCards(): Card[];
    addCard(card: Card): void;
    addCards(cards: Card[]): void;
    reset(cards: Card[]): void;
}
//# sourceMappingURL=index.d.ts.map