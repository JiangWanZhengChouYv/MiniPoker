// 版本信息
export const gameCoreVersion = "1.0.0";

// 类型定义
export * from './types';

// 卡牌工具
export { CardUtil } from './card';

// 牌堆管理
export { Deck } from './deck';

// 牌型判断
export { HandUtil } from './hand';

// 游戏实现
export { DouDiZhuGame } from './games/doudizhu';
export { GuanDanGame } from './games/guandan';
export { ZhaJinHuaGame, ZhaJinHuaHandType } from './games/zhaojinhua';

// AI 玩家
export { SimpleAI } from './ai';
