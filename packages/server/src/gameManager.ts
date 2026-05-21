import type { Room, GameState } from './types';

export class GameManager {
  startGame(room: Room): GameState {
    const gameState: GameState = {
      deck: [],
      players: new Map(),
      currentTurn: null,
      phase: 'playing',
      pot: 0
    };

    room.players.forEach((player, playerId) => {
      gameState.players.set(playerId, {
        id: playerId,
        name: player.name,
        chips: 1000,
        cards: [],
        folded: false
      });
    });

    room.gameState = gameState;
    return gameState;
  }

  updateGameState(room: Room, updates: Partial<GameState>): GameState {
    if (!room.gameState) {
      throw new Error('游戏尚未开始');
    }
    room.gameState = { ...room.gameState, ...updates };
    return room.gameState;
  }

  getGameState(room: Room): GameState | null {
    return room.gameState;
  }
}
