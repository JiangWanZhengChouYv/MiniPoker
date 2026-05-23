<template>
  <div class="game-container">
    <div class="game-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>掼蛋</h1>
    </div>

    <div class="game-field">
      <div class="opponent opponent-top">
        <div class="player-info">
          <span class="avatar">🤖</span>
          <span class="name">对手 1</span>
          <span class="card-count">{{ opponent1Cards }}张</span>
        </div>
      </div>

      <div class="middle-section">
        <div class="opponent opponent-left">
          <div class="player-info">
            <span class="avatar">👤</span>
            <span class="name">队友</span>
            <span class="card-count">{{ teammateCards }}张</span>
          </div>
        </div>

        <div class="table-center">
          <div class="hint">掼蛋游戏开发中...</div>
        </div>

        <div class="opponent opponent-right">
          <div class="player-info">
            <span class="avatar">🤖</span>
            <span class="name">对手 2</span>
            <span class="card-count">{{ opponent2Cards }}张</span>
          </div>
        </div>
      </div>

      <div class="player-section">
        <div class="player-info-bottom">
          <span class="avatar">👤</span>
          <span class="name">{{ playerName }}</span>
          <span class="card-count">{{ playerCards.length }}张</span>
        </div>
        <div class="player-cards">
          <PlayingCard
            v-for="(card, index) in playerCards"
            :key="index"
            :rank="card.rank"
            :suit="card.suit"
            :is-selected="selectedCards.includes(index)"
            @click="toggleCard(index)"
          />
        </div>
        <div class="action-buttons">
          <button class="action-btn" @click="playCards">出牌</button>
          <button class="action-btn secondary" @click="pass">不出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import PlayingCard from '@/components/PlayingCard.vue'

const router = useRouter()
const gameStore = useGameStore()

const playerName = gameStore.playerName
const playerCards = ref<any[]>([])
const selectedCards = ref<number[]>([])
const opponent1Cards = ref(27)
const opponent2Cards = ref(27)
const teammateCards = ref(27)

onMounted(() => {
  initGame()
})

function initGame() {
  const suits = ['♠', '♥', '♣', '♦']
  for (let i = 0; i < 27; i++) {
    playerCards.value.push({
      rank: ((i % 13) + 1).toString(),
      suit: suits[i % 4]
    })
  }
}

function toggleCard(index: number) {
  const i = selectedCards.value.indexOf(index)
  if (i > -1) {
    selectedCards.value.splice(i, 1)
  } else {
    selectedCards.value.push(index)
  }
}

function playCards() {
  alert('出牌功能开发中')
}

function pass() {
  alert('不出')
}

function goBack() {
  gameStore.endGame()
  router.push('/')
}
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.game-header {
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

.game-header h1 {
  font-size: 24px;
}

.game-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
}

.opponent {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.opponent-top {
  margin-bottom: 20px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
}

.avatar {
  font-size: 24px;
}

.name {
  font-weight: 500;
}

.card-count {
  background: rgba(102, 126, 234, 0.5);
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
}

.middle-section {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.hint {
  color: rgba(255, 255, 255, 0.5);
  font-size: 18px;
}

.player-section {
  margin-top: 20px;
}

.player-info-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.player-cards {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.player-cards .playing-card {
  margin-left: -30px;
}

.player-cards .playing-card:first-child {
  margin-left: 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.action-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
}
</style>
