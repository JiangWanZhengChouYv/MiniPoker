export interface Player {
  id: string;
  name: string;
  socketId: string;
}

export enum GameType {
  DOUDIZHU = 'doudizhu',
  GUANDAN = 'guandan',
  ZHAOJINHUA = 'zhaojinhua'
}

export interface Room {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  gameType: GameType;
  hostId: string;
  gameState: any;
  isPlaying: boolean;
}

export interface ServerToClientEvents {
  'room:joined': (room: Room) => void;
  'room:left': () => void;
  'room:list': (rooms: Room[]) => void;
  'room:playerJoined': (player: Player) => void;
  'room:playerLeft': (playerId: string) => void;
  'game:state': (state: any) => void;
  'game:started': () => void;
  'game:action': (action: any) => void;
  'error': (message: string) => void;
}

export interface ClientToServerEvents {
  'room:create': (data: { name: string; gameType: GameType; maxPlayers: number; playerName: string }, callback: (room: Room) => void) => void;
  'room:join': (data: { roomId: string; playerName: string }, callback: (room: Room) => void) => void;
  'room:leave': () => void;
  'room:list': (callback: (rooms: Room[]) => void) => void;
  'game:start': () => void;
  'game:action': (action: any) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  playerId?: string;
  roomId?: string;
}
