import type { Player, Room } from './types';

export class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private players: Map<string, Player> = new Map();

  createRoom(roomName: string, maxPlayers: number = 4): Room {
    const roomId = this.generateId();
    const room: Room = {
      id: roomId,
      name: roomName,
      players: new Map(),
      maxPlayers,
      gameState: null,
      createdAt: Date.now()
    };
    this.rooms.set(roomId, room);
    return room;
  }

  joinRoom(playerId: string, playerName: string, roomId: string): { success: boolean; room?: Room; message: string } {
    const room = this.rooms.get(roomId);
    if (!room) {
      return { success: false, message: '房间不存在' };
    }

    if (room.players.size >= room.maxPlayers) {
      return { success: false, message: '房间已满' };
    }

    const player: Player = {
      id: playerId,
      name: playerName,
      roomId
    };

    this.players.set(playerId, player);
    room.players.set(playerId, player);

    return { success: true, room, message: '加入成功' };
  }

  leaveRoom(playerId: string): { success: boolean; roomId?: string; message: string } {
    const player = this.players.get(playerId);
    if (!player || !player.roomId) {
      return { success: false, message: '玩家不在任何房间' };
    }

    const room = this.rooms.get(player.roomId);
    if (room) {
      room.players.delete(playerId);
      if (room.players.size === 0) {
        this.rooms.delete(room.id);
      }
    }

    this.players.delete(playerId);
    return { success: true, roomId: player.roomId, message: '离开成功' };
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  // 转换房间对象以便序列化发送
  serializeRoom(room: Room): any {
    return {
      ...room,
      players: Array.from(room.players.values())
    };
  }

  getAllRooms(): any[] {
    return Array.from(this.rooms.values()).map(room => this.serializeRoom(room));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
