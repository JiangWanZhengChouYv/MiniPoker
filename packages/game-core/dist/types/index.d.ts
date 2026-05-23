export declare enum Suit {
    SPADE = "spade",
    HEART = "heart",
    CLUB = "club",
    DIAMOND = "diamond",
    BLACK_JOKER = "black_joker",
    RED_JOKER = "red_joker"
}
export declare enum Rank {
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
    SIX = 6,
    SEVEN = 7,
    EIGHT = 8,
    NINE = 9,
    TEN = 10,
    J = 11,
    JACK = 11,
    Q = 12,
    QUEEN = 12,
    K = 13,
    KING = 13,
    A = 14,
    ACE = 14,
    TWO = 15,
    BLACK_JOKER = 16,
    RED_JOKER = 17
}
export interface Card {
    suit: Suit;
    rank: Rank;
    id: string;
}
export declare enum HandType {
    SINGLE = "single",
    PAIR = "pair",
    TRIPLE = "triple",
    TRIPLE_ONE = "triple_one",
    TRIPLE_TWO = "triple_two",
    STRAIGHT = "straight",
    STRAIGHT_PAIR = "straight_pair",
    PLANE = "plane",
    PLANE_WITH_SINGLE = "plane_with_single",
    PLANE_WITH_PAIR = "plane_with_pair",
    FOUR_TWO = "four_two",
    FOUR_TWO_PAIR = "four_two_pair",
    BOMB = "bomb",
    ROCKET = "rocket"
}
export interface HandResult {
    type: HandType;
    mainRank: number;
    subRank?: number;
    cards: Card[];
    isValid: boolean;
}
export declare enum GameType {
    DOU_DIZHU = "dou_dizhu",
    GUAN_DAN = "guan_dan",
    ZHA_JIN_HUA = "zha_jin_hua"
}
export interface Player {
    id: string;
    name: string;
    cards: Card[];
    isAI: boolean;
}
//# sourceMappingURL=index.d.ts.map