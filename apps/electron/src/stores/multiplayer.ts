import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { io, Socket } from 'socket.io-client';

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
  gameState: any | null;
  createdAt: number;
}

const SERVER_URL = 'http://localhost:3000';

export const useMultiplayerStore = defineStore('multiplayer', () => {
  const socket = ref<Socket | null>(null);
  const isConnected = ref(false);
  const rooms = ref<Room[]>([]);
  const currentRoom = ref<Room | null>(null);
  const playerName = ref('');
  const playerId = ref('');

  const playersInRoom = computed(() => {
    if (!currentRoom.value) return [];
    return Array.from(currentRoom.value.players.values());
  });

  const isInRoom = computed(() => currentRoom.value !== null);

  function connect() {
    if (socket.value) return;
    
    socket.value = io(SERVER_URL);
    
    socket.value.on('connect', () => {
      isConnected.value = true;
      playerId.value = socket.value?.id || '';
      fetchRooms();
    });

    socket.value.on('disconnect', () => {
      isConnected.value = false;
    });

    socket.value.on('roomCreated', (data: { room: any }) => {
      const room: Room = {
        ...data.room,
        players: new Map(data.room.players.map((p: Player) => [p.id, p]))
      };
      currentRoom.value = room;
    });

    socket.value.on('joinedRoom', (data: { room: any }) => {
      const room: Room = {
        ...data.room,
        players: new Map(data.room.players.map((p: Player) => [p.id, p]))
      };
      currentRoom.value = room;
    });

    socket.value.on('playerJoined', (data: { roomId: string; players: Player[] }) => {
      if (currentRoom.value && currentRoom.value.id === data.roomId) {
        currentRoom.value.players = new Map(data.players.map(p => [p.id, p]));
      }
    });

    socket.value.on('playerLeft', (data: { roomId: string; players: Player[] }) => {
      if (currentRoom.value && currentRoom.value.id === data.roomId) {
        currentRoom.value.players = new Map(data.players.map(p => [p.id, p]));
      }
    });

    socket.value.on('gameStarted', (data: { gameState: any }) => {
      if (currentRoom.value) {
        currentRoom.value.gameState = data.gameState;
      }
    });

    socket.value.on('joinError', (data: { message: string }) => {
      alert(data.message);
    });
  }

  function disconnect() {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      isConnected.value = false;
      currentRoom.value = null;
    }
  }

  async function fetchRooms() {
    try {
      const response = await fetch(`${SERVER_URL}/rooms`);
      const data = await response.json();
      rooms.value = data.rooms;
    } catch (error) {
      console.error('获取房间列表失败:', error);
    }
  }

  function createRoom(roomName: string, maxPlayers: number = 4) {
    if (!socket.value || !playerName.value) return;
    socket.value.emit('createRoom', { roomName, maxPlayers, playerName: playerName.value });
  }

  function joinRoom(roomId: string) {
    if (!socket.value || !playerName.value) return;
    socket.value.emit('joinRoom', { roomId, playerName: playerName.value });
  }

  function leaveRoom() {
    if (!socket.value) return;
    socket.value.emit('leaveRoom');
    currentRoom.value = null;
    fetchRooms();
  }

  function startGame() {
    if (!socket.value || !currentRoom.value) return;
    socket.value.emit('startGame', { roomId: currentRoom.value.id });
  }

  function setPlayerName(name: string) {
    playerName.value = name;
  }

  return {
    socket,
    isConnected,
    rooms,
    currentRoom,
    playerName,
    playerId,
    playersInRoom,
    isInRoom,
    connect,
    disconnect,
    fetchRooms,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    setPlayerName
  };
});
