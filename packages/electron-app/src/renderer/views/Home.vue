<template>
  <div class="home">
    <div class="header">
      <h1>🎴 MiniPoker</h1>
      <p>选择一款游戏开始吧</p>
    </div>

    <div class="mode-selector">
      <div
        class="mode-card"
        :class="{ active: selectedMode === 'single' }"
        @click="selectedMode = 'single'"
      >
        <div class="mode-icon">👤</div>
        <h3>单人模式</h3>
        <p>与 AI 对战</p>
      </div>
      <div
        class="mode-card"
        :class="{ active: selectedMode === 'multi' }"
        @click="selectedMode = 'multi'"
      >
        <div class="mode-icon">👥</div>
        <h3>多人模式</h3>
        <p>局域网/ZeroTier 联机</p>
      </div>
    </div>

    <div v-if="selectedMode === 'single'" class="game-list">
      <div class="game-card" @click="startGame('doudizhu')">
        <div class="game-icon">🃏</div>
        <h2>斗地主</h2>
        <p>经典纸牌游戏</p>
      </div>

      <div class="game-card" @click="startGame('guandan')">
        <div class="game-icon">♠️</div>
        <h2>掼蛋</h2>
        <p>双人合作游戏</p>
      </div>

      <div class="game-card" @click="startGame('zhaojinhua')">
        <div class="game-icon">♣️</div>
        <h2>炸金花</h2>
        <p>比拼运气与胆识</p>
      </div>
    </div>

    <div v-if="selectedMode === 'multi'" class="multi-section">
      <div class="multi-card" @click="goToMultiplayer">
        <div class="game-icon">🎮</div>
        <h2>进入多人大厅</h2>
        <p>创建或加入房间</p>
      </div>
    </div>

    <div class="footer">
      <button class="nav-btn" @click="goToSettings">⚙️ 设置</button>
      <button class="nav-btn" @click="goToStats">📊 统计</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()
const selectedMode = ref<'single' | 'multi'>('single')

function startGame(gameType: string) {
  gameStore.startGame(gameType)
  gameStore.isMultiplayer = false
  router.push(`/game/${gameType}`)
}

function goToMultiplayer() {
  router.push('/multiplayer')
}

function goToSettings() {
  router.push('/settings')
}

function goToStats() {
  router.push('/stats')
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 48px;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
}

.mode-selector {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.mode-card {
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.mode-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.mode-card.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.mode-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.mode-card h3 {
  font-size: 16px;
  margin-bottom: 4px;
}

.mode-card p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.game-list,
.multi-section {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 60px;
}

.game-card,
.multi-card {
  width: 200px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.game-card:hover,
.multi-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.game-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.game-card h2,
.multi-card h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.game-card p,
.multi-card p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.footer {
  display: flex;
  gap: 20px;
}

.nav-btn {
  padding: 12px 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}
</style>
