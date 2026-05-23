<template>
  <div class="multiplayer-room">
    <div class="header">
      <button class="back-btn" @click="leave">← 离开房间</button>
      <h1>🎮 {{ room?.name }}</h1>
    </div>

    <div v-if="room" class="content">
      <div class="room-info">
        <div class="info-card">
          <h3>游戏类型</h3>
          <p>{{ getGameTypeName(room.gameType) }}</p>
        </div>
        <div class="info-card">
          <h3>房间代码</h3>
          <p class="room-code">{{ room.id }}</p>
        </div>
      </div>

      <div class="players-section">
        <h2>玩家列表 ({{ room.players.length }} / {{ room.maxPlayers }})</h2>
        <div class="players">
          <div
            v-for="player in room.players"
            :key="player.id"
            class="player-card"
            :class="{ host: player.id === room.hostId }"
          >
            <div class="player-avatar">
              {{ player.name.charAt(0).toUpperCase() }}
            </div>
            <div class="player-info">
              <h4>{{ player.name }}</h4>
              <span v-if="player.id === room.hostId" class="host-badge">房主</span>
            </div>
          </div>
          <div
            v-for="i in room.maxPlayers - room.players.length"
            :key="'empty-' + i"
            class="player-card empty"
          >
            <div class="player-avatar">?</div>
            <div class="player-info">
              <h4>等待加入...</h4>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button
          v-if="isHost && room.players.length >= 2 && !room.isPlaying"
          @click="startGame"
          class="start-btn"
        >
          开始游戏
        </button>
        <div v-else-if="room.isPlaying" class="game-status">
          <p>游戏进行中...</p>
        </div>
        <div v-else-if="room.players.length < 2" class="game-status">
          <p>至少需要 2 名玩家才能开始</p>
        </div>
        <div v-else class="game-status">
          <p>等待房主开始游戏...</p>
        </div>
      </div>
    </div>

    <div v-else class="no-room">
      <p>您尚未加入任何房间</p>
      <button @click="goToLobby">返回大厅</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMultiplayerStore } from '@/stores/multiplayer'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const multiplayerStore = useMultiplayerStore()
const gameStore = useGameStore()

const room = computed(() => multiplayerStore.currentRoom)
const isHost = computed(() => {
  if (!room.value || !multiplayerStore.socket?.id) return false
  return room.value.hostId === multiplayerStore.socket.id
})

function leave() {
  multiplayerStore.leaveRoom()
  router.push('/multiplayer')
}

function goToLobby() {
  router.push('/multiplayer')
}

function startGame() {
  if (room.value) {
    multiplayerStore.startGame()
    gameStore.startGame(room.value.gameType)
    gameStore.isMultiplayer = true
    setTimeout(() => {
      router.push(`/game/${room.value!.gameType}`)
    }, 500)
  }
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
  if (!multiplayerStore.currentRoom) {
    router.push('/multiplayer')
  }
})

watch(
  () => room.value?.isPlaying,
  (isPlaying) => {
    if (isPlaying && room.value) {
      gameStore.startGame(room.value.gameType)
      gameStore.isMultiplayer = true
      router.push(`/game/${room.value.gameType}`)
    }
  }
)
</script>

<style scoped>
.multiplayer-room {
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
  max-width: 800px;
  margin: 0 auto;
}

.room-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.info-card h3 {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-bottom: 12px;
}

.info-card p {
  font-size: 24px;
  font-weight: 600;
}

.room-code {
  font-family: monospace;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.players-section h2 {
  margin-bottom: 24px;
  text-align: center;
}

.players {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.player-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.player-card.host {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.player-card.empty {
  opacity: 0.4;
}

.player-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
}

.player-info h4 {
  font-size: 16px;
  margin-bottom: 4px;
}

.host-badge {
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
}

.actions {
  text-align: center;
}

.start-btn {
  padding: 16px 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.game-status {
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.no-room {
  text-align: center;
  padding: 80px;
}

.no-room p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24px;
}

.no-room button {
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}
</style>
