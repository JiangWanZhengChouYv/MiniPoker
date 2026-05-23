import { Card, HandResult, Player } from '../../types';
export declare class DouDiZhuGame {
    private deck;
    private players;
    private landlord;
    private currentPlayerId;
    private lastPlayedHand;
    private lastPlayerId;
    private landlordCards;
    private passedPlayers;
    constructor(playerNames: string[]);
    private shuffleDeck;
    dealCards(): void;
    setLandlord(playerId: string): void;
    getPlayers(): Player[];
    getPlayer(playerId: string): Player | undefined;
    getLandlord(): Player | null;
    getCurrentPlayerId(): string | null;
    getLastPlayedHand(): HandResult | null;
    getLandlordCards(): Card[];
    checkHand(cards: Card[]): HandResult;
    playHand(playerId: string, cards: Card[]): boolean;
    pass(playerId: string): boolean;
    private nextPlayer;
    isGameOver(): boolean;
    getWinner(): Player | null;
    getPassedPlayers(): Set<string>;
}
//# sourceMappingURL=index.d.ts.map