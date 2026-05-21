import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { RoomManager } from './roomManager';
import { GameManager } from './gameManager';

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const roomManager = new RoomManager();
const gameManager = new GameManager();

app.get('/', (req, res) => {
  res.json({ message: 'Mini Poker Server is running!' });
});

app.get('/rooms', (req, res) => {
  res.json({ rooms: roomManager.getAllRooms() });
});

io.on('connection', (socket: Socket) => {
  console.log(`用户连接: ${socket.id}`);

  socket.on('createRoom', (data: { roomName: string; maxPlayers?: number; playerName: string }) => {
    const room = roomManager.createRoom(data.roomName, data.maxPlayers || 4);
    const result = roomManager.joinRoom(socket.id, data.playerName, room.id);
    if (result.success) {
      socket.join(room.id);
      socket.emit('roomCreated', { room: roomManager.serializeRoom(room) });
      io.to(room.id).emit('playerJoined', {
        roomId: room.id,
        players: Array.from(room.players.values())
      });
    }
  });

  socket.on('joinRoom', (data: { roomId: string; playerName: string }) => {
    const result = roomManager.joinRoom(socket.id, data.playerName, data.roomId);
    if (result.success && result.room) {
      socket.join(data.roomId);
      socket.emit('joinedRoom', { room: roomManager.serializeRoom(result.room) });
      io.to(data.roomId).emit('playerJoined', {
        roomId: data.roomId,
        players: Array.from(result.room.players.values())
      });
    } else {
      socket.emit('joinError', { message: result.message });
    }
  });

  socket.on('leaveRoom', () => {
    const result = roomManager.leaveRoom(socket.id);
    if (result.success && result.roomId) {
      socket.leave(result.roomId);
      const room = roomManager.getRoom(result.roomId);
      if (room) {
        io.to(result.roomId).emit('playerLeft', {
          roomId: result.roomId,
          players: Array.from(room.players.values())
        });
      }
    }
  });

  socket.on('startGame', (data: { roomId: string }) => {
    const room = roomManager.getRoom(data.roomId);
    if (room) {
      const gameState = gameManager.startGame(room);
      io.to(data.roomId).emit('gameStarted', { gameState });
    }
  });

  socket.on('disconnect', () => {
    console.log(`用户断开连接: ${socket.id}`);
    const result = roomManager.leaveRoom(socket.id);
    if (result.success && result.roomId) {
      const room = roomManager.getRoom(result.roomId);
      if (room) {
        io.to(result.roomId).emit('playerLeft', {
          roomId: result.roomId,
          players: Array.from(room.players.values())
        });
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
