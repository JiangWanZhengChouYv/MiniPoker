<template>
  <div class="stats">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>📊 统计</h1>
      <div class="spacer"></div>
    </div>

    <div class="stats-content">
      <div class="stats-card" v-for="game in games" :key="game.id">
        <div class="card-header">
          <span class="game-icon">{{ game.icon }}</span>
          <h2>{{ game.name }}</h2>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ getTotalGames(game.id) }}</div>
            <div class="stat-label">总场次</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ getWins(game.id) }}</div>
            <div class="stat-label">胜场</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ getLosses(game.id) }}</div>
            <div class="stat-label">负场</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ getWinRate(game.id) }}%</div>
            <div class="stat-label">胜率</div>
          </div>
        </div>
      </div>

      <div class="overall-stats">
        <h2>🎯 总体统计</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ totalGames }}</div>
            <div class="stat-label">总场次</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ totalWins }}</div>
            <div class="stat-label">总胜场</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ overallWinRate }}%</div>
            <div class="stat-label">总胜率</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStatsStore } from '@/stores/stats'

const router = useRouter()
const statsStore = useStatsStore()

const games = [
  { id: 'doudizhu', name: '斗地主', icon: '🃏' },
  { id: 'guandan', name: '掼蛋', icon: '♠️' },
  { id: 'zhaojinhua', name: '炸金花', icon: '♣️' }
]

function getTotalGames(gameId: string): number {
  return statsStore.getStats(gameId).totalGames
}

function getWins(gameId: string): number {
  return statsStore.getStats(gameId).wins
}

function getLosses(gameId: string): number {
  return statsStore.getStats(gameId).losses
}

function getWinRate(gameId: string): number {
  return Math.round(statsStore.getWinRate(gameId))
}

const totalGames = computed(() => {
  return statsStore.doudizhu.totalGames + statsStore.guandan.totalGames + statsStore.zhaojinhua.totalGames
})

const totalWins = computed(() => {
  return statsStore.doudizhu.wins + statsStore.guandan.wins + statsStore.zhaojinhua.wins
})

const overallWinRate = computed(() => {
  if (totalGames.value === 0) return 0
  return Math.round((totalWins.value / totalGames.value) * 100)
})

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.stats {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: rgba(0, 0, 0, 0.2);
}

.back-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: white;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.header h1 {
  font-size: 24px;
}

.spacer {
  width: 80px;
}

.stats-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

.stats-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.game-icon {
  font-size: 36px;
}

.card-header h2 {
  font-size: 22px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.overall-stats {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  max-width: 800px;
  margin: 0 auto;
}

.overall-stats h2 {
  font-size: 22px;
  margin-bottom: 25px;
  text-align: center;
}
</style>
