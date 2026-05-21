export interface Player {
  id: string;
  name: string;
  roomId: string | null;
}

export interface Room {
  id: string;
  name: string;
  players: Map<string, Player>;
  maxPlayers: number;
  gameState: GameState | null;
  createdAt: number;
}

export interface GameState {
  deck: any[];
  players: Map<string, any>;
  currentTurn: string | null;
  phase: 'waiting' | 'playing' | 'ended';
  pot: number;
}
