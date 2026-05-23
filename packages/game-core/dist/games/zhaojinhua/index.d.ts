import { Card, Player } from '../../types';
export declare enum ZhaJinHuaHandType {
    SINGLE = 1,
    PAIR = 2,
    STRAIGHT = 3,
    FLUSH = 4,
    FULL_HOUSE = 5,
    FOUR_OF_A_KIND = 6,
    STRAIGHT_FLUSH = 7
}
export interface ZhaJinHuaHandResult {
    type: ZhaJinHuaHandType;
    mainRank: number;
    secondRank?: number;
    kickerRanks?: number[];
    isValid: boolean;
}
export declare class ZhaJinHuaGame {
    private deck;
    private players;
    private currentPlayerId;
    private pot;
    private currentBet;
    private gameStarted;
    private foldedPlayers;
    private playerBets;
    constructor(playerNames: string[]);
    startGame(initialBet?: number): void;
    private shuffleDeck;
    getPlayers(): Player[];
    getPlayer(playerId: string): Player | undefined;
    getCurrentPlayerId(): string | null;
    getPot(): number;
    getCurrentBet(): number;
    getFoldedPlayers(): Set<string>;
    getPlayerBet(playerId: string): number;
    isGameStarted(): boolean;
    static checkHand(cards: Card[]): ZhaJinHuaHandResult;
    static compareHands(hand1: ZhaJinHuaHandResult, hand2: ZhaJinHuaHandResult): number;
    bet(playerId: string, amount: number): boolean;
    call(playerId: string): boolean;
    raise(playerId: string, amount: number): boolean;
    fold(playerId: string): boolean;
    showdown(): Player | null;
    private nextPlayer;
}
//# sourceMappingURL=index.d.ts.map