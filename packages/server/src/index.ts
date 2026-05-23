import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { RoomManager } from './RoomManager';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  Player,
  GameType,
} from './types';
import { gameCoreVersion } from '@minipoker/game-core';
import { v4 as uuidv4 } from 'crypto';
import os from 'os';

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: {
    origin: '*',
  },
});

const roomManager = new RoomManager();

console.log(`Server using game-core v${gameCoreVersion}`);

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('room:list', (callback) => {
    callback(roomManager.getRooms());
  });

  socket.on('room:create', (data, callback) => {
    const playerId = uuidv4();
    const player: Player = {
      id: playerId,
      name: data.playerName,
      socketId: socket.id,
    };

    const room = roomManager.createRoom(
      data.name,
      data.gameType,
      data.maxPlayers,
      player
    );

    socket.data.playerId = playerId;
    socket.data.roomId = room.id;
    socket.join(room.id);

    callback(room);
  });

  socket.on('room:join', (data, callback) => {
    const playerId = uuidv4();
    const player: Player = {
      id: playerId,
      name: data.playerName,
      socketId: socket.id,
    };

    const room = roomManager.joinRoom(data.roomId, player);
    if (!room) {
      socket.emit('error', '房间不存在或已满');
      return;
    }

    socket.data.playerId = playerId;
    socket.data.roomId = room.id;
    socket.join(room.id);

    callback(room);
    io.to(room.id).emit('room:playerJoined', player);
  });

  socket.on('room:leave', () => {
    if (!socket.data.roomId || !socket.data.playerId) return;

    const room = roomManager.leaveRoom(socket.data.roomId, socket.data.playerId);
    socket.leave(socket.data.roomId);

    if (room) {
      io.to(room.id).emit('room:playerLeft', socket.data.playerId);
    }

    socket.data.roomId = undefined;
    socket.data.playerId = undefined;
  });

  socket.on('game:start', () => {
    if (!socket.data.roomId || !socket.data.playerId) return;

    const room = roomManager.getRoom(socket.data.roomId);
    if (!room || room.hostId !== socket.data.playerId) return;

    if (roomManager.startGame(socket.data.roomId)) {
      io.to(room.id).emit('game:started');
      io.to(room.id).emit('game:state', room.gameState);
    }
  });

  socket.on('game:action', (action) => {
    if (!socket.data.roomId) return;

    const room = roomManager.getRoom(socket.data.roomId);
    if (!room) return;

    roomManager.updateGameState(socket.data.roomId, { ...room.gameState, lastAction: action });
    io.to(room.id).emit('game:action', action);
    io.to(room.id).emit('game:state', room.gameState);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);

    if (socket.data.roomId && socket.data.playerId) {
      const room = roomManager.leaveRoom(socket.data.roomId, socket.data.playerId);
      if (room) {
        io.to(room.id).emit('room:playerLeft', socket.data.playerId);
      }
    }
  });
});

const getLocalIPs = (): string[] => {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];

  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (!iface) continue;

    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        ips.push(alias.address);
      }
    }
  }

  return ips;
};

httpServer.listen(PORT, () => {
  console.log(`🚀 MiniPoker Server is running on port ${PORT}`);
  console.log('📡 Listening on:');
  console.log(`  - Local: http://localhost:${PORT}`);
  
  const localIPs = getLocalIPs();
  for (const ip of localIPs) {
    console.log(`  - Network: http://${ip}:${PORT}`);
  }
  
  console.log(`\n✨ Supports both LAN and ZeroTier virtual networks!`);
});

