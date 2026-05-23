import { Room, Player, GameType } from './types';
import { DouDiZhuGame, GuanDanGame, ZhaJinHuaGame } from '@minipoker/game-core';
import { v4 as uuidv4 } from 'crypto';

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  createRoom(name: string, gameType: GameType, maxPlayers: number, host: Player): Room {
    const roomId = uuidv4().substring(0, 8);
    const room: Room = {
      id: roomId,
      name,
      players: [host],
      maxPlayers,
      gameType,
      hostId: host.id,
      gameState: null,
      isPlaying: false,
    };
    this.rooms.set(roomId, room);
    return room;
  }

  joinRoom(roomId: string, player: Player): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    if (room.players.length >= room.maxPlayers) return null;
    if (room.isPlaying) return null;

    room.players.push(player);
    return room;
  }

  leaveRoom(roomId: string, playerId: string): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.players = room.players.filter(p => p.id !== playerId);

    if (room.players.length === 0) {
      this.rooms.delete(roomId);
      return null;
    }

    if (room.hostId === playerId) {
      room.hostId = room.players[0].id;
    }

    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  getRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  startGame(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    if (room.players.length < 2) return false;

    room.isPlaying = true;

    switch (room.gameType) {
      case GameType.DOUDIZHU:
        room.gameState = new DouDiZhuGame();
        break;
      case GameType.GUANDAN:
        room.gameState = new GuanDanGame();
        break;
      case GameType.ZHAOJINHUA:
        room.gameState = new ZhaJinHuaGame();
        break;
    }

    return true;
  }

  updateGameState(roomId: string, state: any): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.gameState = state;
    }
  }
}
