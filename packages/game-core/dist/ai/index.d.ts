import { Card } from '../types';
import { DouDiZhuGame } from '../games/doudizhu';
import { GuanDanGame } from '../games/guandan';
import { ZhaJinHuaGame } from '../games/zhaojinhua';
export declare class SimpleAI {
    static makeDouDiZhuMove(game: DouDiZhuGame, playerId: string): {
        action: 'play' | 'pass';
        cards?: Card[];
    };
    static makeGuanDanMove(game: GuanDanGame, playerId: string): {
        action: 'play' | 'pass';
        cards?: Card[];
    };
    static makeZhaJinHuaMove(game: ZhaJinHuaGame, playerId: string): {
        action: 'call' | 'raise' | 'fold';
        raiseAmount?: number;
    };
    private static findSmallestValidHand;
    private static findSmallestPair;
    private static findSmallestTriple;
    private static findBeatingHand;
    private static generateAllPossibleHands;
}
//# sourceMappingURL=index.d.ts.map