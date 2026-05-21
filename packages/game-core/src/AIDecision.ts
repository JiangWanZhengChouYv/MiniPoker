import { Card } from './Card';
import { HandResult, PlayerRole } from './DouDiZhu';

export interface AIDecisionContext {
  playerId: number;
  handCards: Card[];
  lastPlay: HandResult | null;
  lastPlayerId: number | null;
  role: PlayerRole;
  players: { id: number; cardCount: number; role: PlayerRole }[];
}

export interface AIDecision {
  shouldPlay: boolean;
  cards: Card[];
}

export interface IAIDecisionMaker {
  decide(context: AIDecisionContext): AIDecision;
}
