import { Card } from './Card';

export interface BaseHandResult {
  type: string;
  mainRank?: number;
  cards: Card[];
}

export interface BaseGamePlayer {
  id: number;
  cards: Card[];
}

export enum BaseGameState {
  Waiting = 'waiting',
  Playing = 'playing',
  Finished = 'finished'
}

export interface BaseGame<TPlayer extends BaseGamePlayer, THandResult extends BaseHandResult> {
  startGame(): void;
  getGameState(): string;
  getPlayers(): TPlayer[];
  getCurrentPlayerId(): number;
  getWinnerId(): number | null;
}
