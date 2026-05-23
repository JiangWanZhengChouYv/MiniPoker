import { Card, HandResult, Player } from '../../types';
export declare class GuanDanGame {
    private deck;
    private players;
    private currentPlayerId;
    private lastPlayedHand;
    private lastPlayerId;
    private currentLevel;
    private passedPlayers;
    constructor(playerNames: string[]);
    private shuffleDeck;
    dealCards(): void;
    getPlayers(): Player[];
    getPlayer(playerId: string): Player | undefined;
    getCurrentPlayerId(): string | null;
    getLastPlayedHand(): HandResult | null;
    getCurrentLevel(): number;
    isWildCard(card: Card): boolean;
    checkHand(cards: Card[]): HandResult;
    playHand(playerId: string, cards: Card[]): boolean;
    pass(playerId: string): boolean;
    private nextPlayer;
    isGameOver(): boolean;
    getWinner(): Player | null;
    getPassedPlayers(): Set<string>;
}
//# sourceMappingURL=index.d.ts.map