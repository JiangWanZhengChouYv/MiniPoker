<template>
  <div class="multiplayer-lobby">
    <div class="lobby-content">
      <div class="header">
        <button class="back-btn" @click="goBack">← 返回</button>
        <h1 class="title">多人游戏</h1>
      </div>

      <div v-if="!multiplayerStore.isConnected" class="connect-section">
        <div class="input-group">
          <label>玩家名称</label>
          <input 
            v-model="localPlayerName" 
            type="text" 
            placeholder="请输入你的玩家名称"
            @keyup.enter="handleConnect"
          />
        </div>
        <button class="connect-btn" @click="handleConnect" :disabled="!localPlayerName">
          连接服务器
        </button>
      </div>

      <div v-else class="main-section">
        <div class="status-bar">
          <span class="status connected">✓ 已连接</span>
          <span class="player-name">玩家: {{ multiplayerStore.playerName }}</span>
          <button class="refresh-btn" @click="multiplayerStore.fetchRooms">刷新房间</button>
        </div>

        <div class="create-room-section">
          <h3>创建房间</h3>
          <div class="create-room-form">
            <input 
              v-model="newRoomName" 
              type="text" 
              placeholder="房间名称"
              @keyup.enter="handleCreateRoom"
            />
            <select v-model="newMaxPlayers">
              <option :value="2">2人</option>
              <option :value="3">3人</option>
              <option :value="4">4人</option>
            </select>
            <button class="create-btn" @click="handleCreateRoom" :disabled="!newRoomName">
              创建房间
            </button>
          </div>
        </div>

        <div class="rooms-section">
          <h3>房间列表</h3>
          <div v-if="multiplayerStore.rooms.length === 0" class="empty-state">
            暂无房间，创建一个吧！
          </div>
          <div v-else class="rooms-list">
            <div v-for="room in multiplayerStore.rooms" :key="room.id" class="room-card">
              <div class="room-info">
                <h4>{{ room.name }}</h4>
                <p class="room-details">
                  {{ room.players.size }}/{{ room.maxPlayers }} 人
                </p>
              </div>
              <button 
                class="join-btn" 
                @click="multiplayerStore.joinRoom(room.id)"
                :disabled="room.players.size >= room.maxPlayers"
              >
                加入
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMultiplayerStore } from '../stores/multiplayer';
import { useGameStore, GameType } from '../stores/game';

const multiplayerStore = useMultiplayerStore();
const gameStore = useGameStore();
const localPlayerName = ref('');
const newRoomName = ref('');
const newMaxPlayers = ref(3);

function handleConnect() {
  if (localPlayerName.value) {
    multiplayerStore.setPlayerName(localPlayerName.value);
    multiplayerStore.connect();
  }
}

function handleCreateRoom() {
  if (newRoomName.value) {
    multiplayerStore.createRoom(newRoomName.value, newMaxPlayers.value);
    newRoomName.value = '';
  }
}

function goBack() {
  multiplayerStore.disconnect();
  gameStore.selectGameType(GameType.None);
}
</script>

<style scoped>
.multiplayer-lobby {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 2rem;
}

.lobby-content {
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #e94560;
  text-shadow: 0 4px 12px rgba(233, 69, 96, 0.4);
  margin: 0;
}

.connect-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
}

.input-group {
  margin-bottom: 2rem;
}

.input-group label {
  display: block;
  color: #e0e0e0;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.input-group input {
  width: 100%;
  max-width: 400px;
  padding: 1rem 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  color: #ffffff;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: #e94560;
}

.connect-btn {
  background: #e94560;
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 12px;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.connect-btn:hover:not(:disabled) {
  background: #ff6b81;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(233, 69, 96, 0.4);
}

.connect-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.main-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  flex-wrap: wrap;
}

.status {
  color: #4ade80;
  font-weight: bold;
}

.player-name {
  color: #e0e0e0;
}

.refresh-btn {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #ffffff;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.create-room-section,
.rooms-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
}

.create-room-section h3,
.rooms-section h3 {
  color: #ffffff;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.create-room-form {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.create-room-form input,
.create-room-form select {
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.3);
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.create-room-form input {
  flex: 1;
  min-width: 200px;
}

.create-room-form select {
  min-width: 100px;
}

.create-room-form input:focus,
.create-room-form select:focus {
  border-color: #e94560;
}

.create-btn {
  background: #e94560;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.create-btn:hover:not(:disabled) {
  background: #ff6b81;
}

.create-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  color: #b0b0b0;
  text-align: center;
  padding: 2rem;
}

.rooms-list {
  display: grid;
  gap: 1rem;
}

.room-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.room-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(233, 69, 96, 0.5);
}

.room-info h4 {
  color: #ffffff;
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
}

.room-details {
  color: #b0b0b0;
  margin: 0;
}

.join-btn {
  background: #4ade80;
  color: #1a1a2e;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.join-btn:hover:not(:disabled) {
  background: #22c55e;
  transform: translateY(-2px);
}

.join-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #6b7280;
}
</style>
