<template>
  <div class="multiplayer-lobby">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>🎮 多人模式</h1>
    </div>

    <div class="content">
      <div class="connection-panel">
        <div class="connection-status" :class="{ connected: isConnected }">
          <span class="status-dot"></span>
          {{ isConnected ? '已连接' : '未连接' }}
        </div>

        <div class="server-input">
          <input
            v-model="serverUrl"
            type="text"
            placeholder="服务器地址 (例如: http://localhost:3000)"
            :disabled="isConnected"
          />
          <button @click="toggleConnection">
            {{ isConnected ? '断开' : '连接' }}
          </button>
        </div>

        <div class="player-name">
          <label>玩家昵称：</label>
          <input
            v-model="playerNameInput"
            type="text"
            placeholder="输入您的昵称"
            @input="updatePlayerName"
          />
        </div>
      </div>

      <div v-if="isConnected" class="room-section">
        <div class="create-room">
          <h3>创建房间</h3>
          <div class="create-form">
            <input
              v-model="newRoomName"
              type="text"
              placeholder="房间名称"
            />
            <select v-model="selectedGameType">
              <option value="doudizhu">斗地主</option>
              <option value="guandan">掼蛋</option>
              <option value="zhaojinhua">炸金花</option>
            </select>
            <select v-model="selectedMaxPlayers">
              <option :value="2">2 人</option>
              <option :value="3">3 人</option>
              <option :value="4">4 人</option>
            </select>
            <button @click="createRoom" class="create-btn">创建</button>
          </div>
        </div>

        <div class="room-list">
          <div class="list-header">
            <h3>可用房间</h3>
            <button @click="refreshRooms" class="refresh-btn">刷新</button>
          </div>

          <div v-if="availableRooms.length === 0" class="empty-rooms">
            <p>暂无可用房间</p>
          </div>

          <div v-else class="rooms">
            <div v-for="room in availableRooms" :key="room.id" class="room-card">
              <div class="room-info">
                <h4>{{ room.name }}</h4>
                <p class="game-type">{{ getGameTypeName(room.gameType) }}</p>
                <p class="players">
                  {{ room.players.length }} / {{ room.maxPlayers }}
                </p>
              </div>
              <button
                @click="joinRoom(room.id)"
                :disabled="room.players.length >= room.maxPlayers || room.isPlaying"
              >
                加入
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMultiplayerStore } from '@/stores/multiplayer'

const router = useRouter()
const multiplayerStore = useMultiplayerStore()

const isConnected = ref(false)
const serverUrl = ref('http://localhost:3000')
const playerNameInput = ref('玩家')
const newRoomName = ref('')
const selectedGameType = ref('doudizhu')
const selectedMaxPlayers = ref(3)
const availableRooms = ref<any[]>([])
const errorMessage = ref('')

let refreshInterval: number | null = null

function goBack() {
  router.push('/')
}

function toggleConnection() {
  if (isConnected.value) {
    multiplayerStore.disconnect()
    isConnected.value = false
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  } else {
    multiplayerStore.connect(serverUrl.value)
    isConnected.value = true
    refreshRooms()
    refreshInterval = window.setInterval(refreshRooms, 3000)
  }
}

function updatePlayerName() {
  multiplayerStore.setPlayerName(playerNameInput.value)
}

async function createRoom() {
  if (!newRoomName.value) return
  try {
    const room = await multiplayerStore.createRoom(
      newRoomName.value,
      selectedGameType.value,
      selectedMaxPlayers.value
    )
    router.push('/multiplayer/room')
  } catch (e) {
    console.error('Failed to create room:', e)
  }
}

async function joinRoom(roomId: string) {
  try {
    const room = await multiplayerStore.joinRoom(roomId)
    router.push('/multiplayer/room')
  } catch (e) {
    console.error('Failed to join room:', e)
  }
}

async function refreshRooms() {
  availableRooms.value = await multiplayerStore.listRooms()
}

function getGameTypeName(type: string): string {
  const names: Record<string, string> = {
    doudizhu: '斗地主',
    guandan: '掼蛋',
    zhaojinhua: '炸金花'
  }
  return names[type] || type
}

onMounted(() => {
  playerNameInput.value = multiplayerStore.playerName
  if (multiplayerStore.isConnected) {
    isConnected.value = true
    serverUrl.value = multiplayerStore.serverUrl
    refreshRooms()
    refreshInterval = window.setInterval(refreshRooms, 3000)
  }
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.multiplayer-lobby {
  width: 100%;
  height: 100%;
  padding: 40px;
  overflow-y: auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.back-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.header h1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content {
  max-width: 900px;
  margin: 0 auto;
}

.connection-panel {
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  font-size: 16px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ef4444;
}

.connection-status.connected .status-dot {
  background: #22c55e;
}

.server-input {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.server-input input,
.player-name input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 14px;
}

.server-input input:disabled {
  opacity: 0.5;
}

.server-input button,
.player-name label {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.server-input button:hover {
  transform: scale(1.05);
}

.player-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-name label {
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.1);
  cursor: default;
}

.room-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
}

.create-room,
.room-list {
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.create-room h3,
.list-header h3 {
  margin-bottom: 16px;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.create-form input,
.create-form select {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 14px;
}

.create-form select option {
  background: #1a1a2e;
}

.create-btn {
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: scale(1.02);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.refresh-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 12px;
}

.empty-rooms {
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.5);
}

.rooms {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.room-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.room-info h4 {
  margin-bottom: 4px;
  font-size: 16px;
}

.game-type {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
}

.players {
  font-size: 14px;
  color: #667eea;
}

.room-card button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.room-card button:hover:not(:disabled) {
  transform: scale(1.05);
}

.room-card button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  margin-top: 20px;
  padding: 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #fca5a5;
}

@media (max-width: 768px) {
  .room-section {
    grid-template-columns: 1fr;
  }
}
</style>
