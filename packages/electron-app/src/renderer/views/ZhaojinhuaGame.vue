<template>
  <div class="game-container">
    <div class="game-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>炸金花</h1>
      <div class="pot-info">
        <span>💰 底池: {{ pot }}</span>
      </div>
    </div>

    <div class="game-field">
      <div class="opponent opponent-top">
        <div class="player-info">
          <span class="avatar">🤖</span>
          <span class="name">AI 玩家 1</span>
          <span class="chips">{{ chips1 }} 💰</span>
        </div>
        <div class="opponent-cards">
          <PlayingCard v-for="i in 3" :key="i" rank="?" suit="?" :is-flipped="true" />
        </div>
        <div class="player-bet" v-if="currentBet > 0">{{ currentBet }}</div>
      </div>

      <div class="table-center">
        <div class="pot-display">
          <div class="pot-amount">{{ pot }}</div>
          <div class="pot-label">底池</div>
        </div>
      </div>

      <div class="player-section">
        <div class="player-cards">
          <PlayingCard
            v-for="(card, index) in playerCards"
            :key="index"
            :rank="card.rank"
            :suit="card.suit"
            :is-flipped="!showCards"
            @click="showCards = !showCards"
          />
        </div>
        <div class="player-info-bottom">
          <span class="avatar">👤</span>
          <span class="name">{{ playerName }}</span>
          <span class="chips">{{ playerChips }} 💰</span>
        </div>
        <div class="action-buttons">
          <button class="action-btn" @click="fold">弃牌</button>
          <button class="action-btn" @click="call">跟注 {{ currentBet }}</button>
          <button class="action-btn primary" @click="raise">加注</button>
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
const playerChips = ref(1000)
const chips1 = ref(1000)
const pot = ref(100)
const currentBet = ref(10)
const showCards = ref(false)

onMounted(() => {
  initGame()
})

function initGame() {
  const suits = ['♠', '♥', '♣', '♦']
  for (let i = 0; i < 3; i++) {
    playerCards.value.push({
      rank: ((Math.floor(Math.random() * 13) + 1)).toString(),
      suit: suits[Math.floor(Math.random() * 4)]
    })
  }
}

function fold() {
  alert('你弃牌了')
  goBack()
}

function call() {
  playerChips.value -= currentBet.value
  pot.value += currentBet.value
  alert('你跟注了')
}

function raise() {
  const raiseAmount = prompt('请输入加注金额:')
  if (raiseAmount) {
    const amount = parseInt(raiseAmount)
    if (amount > 0 && amount <= playerChips.value) {
      playerChips.value -= amount
      pot.value += amount
      currentBet.value = amount
      alert(`你加注了 ${amount}`)
    }
  }
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

.pot-info {
  font-size: 18px;
}

.game-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px;
  position: relative;
}

.opponent {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.opponent-top {
  margin-bottom: 40px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 25px;
}

.avatar {
  font-size: 28px;
}

.name {
  font-weight: 500;
}

.chips {
  background: rgba(241, 196, 15, 0.3);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
}

.opponent-cards {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.player-bet {
  background: rgba(102, 126, 234, 0.5);
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 500;
}

.table-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pot-display {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 30px 50px;
  border-radius: 50%;
  border: 3px solid rgba(241, 196, 15, 0.5);
}

.pot-amount {
  font-size: 36px;
  font-weight: bold;
  color: #f1c40f;
}

.pot-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
}

.player-section {
  margin-top: 40px;
}

.player-cards {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.player-info-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.action-btn {
  padding: 12px 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.2);
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.action-btn.primary:hover {
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}
</style>
