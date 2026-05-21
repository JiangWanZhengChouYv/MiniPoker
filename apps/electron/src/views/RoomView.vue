<template>
  <div class="room-view">
    <div class="room-content">
      <div class="header">
        <button class="back-btn" @click="handleLeave">← 离开房间</button>
        <h1 class="title">{{ multiplayerStore.currentRoom?.name }}</h1>
      </div>

      <div class="room-info">
        <div class="info-card">
          <h3>房间 ID</h3>
          <p class="room-id">{{ multiplayerStore.currentRoom?.id }}</p>
        </div>
        <div class="info-card">
          <h3>当前人数</h3>
          <p class="player-count">
            {{ multiplayerStore.playersInRoom.length }}/{{ multiplayerStore.currentRoom?.maxPlayers }}
          </p>
        </div>
      </div>

      <div class="players-section">
        <h2>玩家列表</h2>
        <div class="players-grid">
          <div 
            v-for="player in multiplayerStore.playersInRoom" 
            :key="player.id" 
            class="player-card"
            :class="{ 'is-host': isHost(player.id), 'is-me': isMe(player.id) }"
          >
            <div class="player-avatar">
              {{ player.name.charAt(0).toUpperCase() }}
            </div>
            <div class="player-info">
              <h4>{{ player.name }}</h4>
              <p v-if="isMe(player.id)" class="me-label">我</p>
              <p v-else-if="isHost(player.id)" class="host-label">房主</p>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-section">
        <button 
          v-if="isHost(multiplayerStore.playerId) && multiplayerStore.playersInRoom.length >= 2"
          class="start-btn"
          @click="handleStartGame"
        >
          开始游戏
        </button>
        <p v-else-if="isHost(multiplayerStore.playerId)" class="waiting-text">
          等待更多玩家加入... (至少需要 2 人)
        </p>
        <p v-else class="waiting-text">
          等待房主开始游戏...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMultiplayerStore } from '../stores/multiplayer';
import { useGameStore, GameType } from '../stores/game';

const multiplayerStore = useMultiplayerStore();
const gameStore = useGameStore();

const isHost = (playerId: string) => {
  const firstPlayer = multiplayerStore.playersInRoom[0];
  return firstPlayer?.id === playerId;
};

const isMe = (playerId: string) => {
  return playerId === multiplayerStore.playerId;
};

function handleLeave() {
  multiplayerStore.leaveRoom();
  gameStore.selectGameType(GameType.None);
}

function handleStartGame() {
  multiplayerStore.startGame();
}
</script>

<style scoped>
.room-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 2rem;
}

.room-content {
  max-width: 900px;
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

.room-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
}

.info-card h3 {
  color: #b0b0b0;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: normal;
}

.room-id,
.player-count {
  color: #ffffff;
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  font-family: monospace;
}

.players-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.players-section h2 {
  color: #ffffff;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.player-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.player-card:hover {
  background: rgba(255, 255, 255, 0.1);
}

.player-card.is-host {
  border-color: #e94560;
  box-shadow: 0 0 20px rgba(233, 69, 96, 0.3);
}

.player-card.is-me {
  border-color: #4ade80;
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
}

.player-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e94560, #ff6b81);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.player-info h4 {
  color: #ffffff;
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.me-label,
.host-label {
  margin: 0;
  font-size: 0.875rem;
  font-weight: bold;
}

.me-label {
  color: #4ade80;
}

.host-label {
  color: #e94560;
}

.actions-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
}

.start-btn {
  background: #4ade80;
  color: #1a1a2e;
  border: none;
  padding: 1rem 3rem;
  border-radius: 12px;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.start-btn:hover {
  background: #22c55e;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(74, 222, 128, 0.4);
}

.waiting-text {
  color: #b0b0b0;
  margin: 0;
  font-size: 1.1rem;
}
</style>
