<template>
  <div class="game-container">
    <div class="game-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>斗地主</h1>
      <div class="game-info">
        <span v-if="isLandlord">👑 地主</span>
        <span v-else>👤 农民</span>
      </div>
    </div>

    <div class="game-field">
      <div class="opponent opponent-top">
        <div class="player-info">
          <span class="avatar">🤖</span>
          <span class="name">AI 对手 1</span>
          <span class="card-count">{{ opponent1Cards }}张</span>
        </div>
        <div class="opponent-cards">
          <div v-for="i in opponent1Cards" :key="i" class="card-back-small"></div>
        </div>
      </div>

      <div class="middle-section">
        <div class="opponent opponent-left">
          <div class="player-info">
            <span class="avatar">🤖</span>
            <span class="name">AI 对手 2</span>
            <span class="card-count">{{ opponent2Cards }}张</span>
          </div>
          <div class="opponent-cards vertical">
            <div v-for="i in opponent2Cards" :key="i" class="card-back-small vertical"></div>
          </div>
        </div>

        <div class="table-center">
          <div class="played-cards" v-if="lastPlayedCards.length > 0">
            <div v-for="(card, index) in lastPlayedCards" :key="index" class="played-card">
              <PlayingCard :rank="card.rank" :suit="card.suit" />
            </div>
          </div>
          <div v-else class="hint">请出牌</div>
        </div>

        <div class="dipai" v-if="dipai.length > 0">
          <h3>底牌</h3>
          <div class="dipai-cards">
            <PlayingCard v-for="(card, index) in dipai" :key="index" :rank="card.rank" :suit="card.suit" />
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
          <button class="action-btn" :disabled="!canPlay" @click="playCards">出牌</button>
          <button class="action-btn secondary" @click="pass">不出</button>
          <button class="action-btn hint" @click="hint">提示</button>
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
import * as GameCore from '@minipoker/game-core'

const router = useRouter()
const gameStore = useGameStore()

const playerName = gameStore.playerName
const playerCards = ref<any[]>([])
const selectedCards = ref<number[]>([])
const opponent1Cards = ref(17)
const opponent2Cards = ref(17)
const dipai = ref<any[]>([])
const lastPlayedCards = ref<any[]>([])
const isLandlord = ref(false)
const canPlay = ref(true)

onMounted(() => {
  initGame()
})

function initGame() {
  const deck = new GameCore.Deck()
  deck.shuffle()
  
  const hands = deck.deal(3, 17)
  playerCards.value = hands[0].cards.map(c => ({ rank: c.rank.toString(), suit: c.suit }))
  dipai.value = deck.draw(3).map(c => ({ rank: c.rank.toString(), suit: c.suit }))
  
  isLandlord.value = Math.random() > 0.5
  if (isLandlord.value) {
    playerCards.value.push(...dipai.value)
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
  if (selectedCards.value.length === 0) return
  
  const cardsToPlay = selectedCards.value.map(i => playerCards.value[i])
  lastPlayedCards.value = cardsToPlay
  
  selectedCards.value.sort((a, b) => b - a).forEach(i => {
    playerCards.value.splice(i, 1)
  })
  
  selectedCards.value = []
  
  if (playerCards.value.length === 0) {
    alert('恭喜获胜！')
    goBack()
  } else {
    simulateAIPlay()
  }
}

function pass() {
  lastPlayedCards.value = []
  simulateAIPlay()
}

function hint() {
  if (playerCards.value.length > 0) {
    selectedCards.value = [0]
  }
}

function simulateAIPlay() {
  canPlay.value = false
  setTimeout(() => {
    if (Math.random() > 0.3) {
      const fakeCard = { rank: '5', suit: '♠' }
      lastPlayedCards.value = [fakeCard]
      if (opponent1Cards.value > opponent2Cards.value) {
        opponent1Cards.value--
      } else {
        opponent2Cards.value--
      }
    } else {
      lastPlayedCards.value = []
    }
    canPlay.value = true
  }, 1500)
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

.game-info {
  font-size: 18px;
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

.opponent-left {
  flex-direction: row;
  align-items: flex-start;
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

.opponent-left .player-info {
  flex-direction: column;
  gap: 5px;
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

.opponent-cards {
  display: flex;
  gap: -15px;
}

.card-back-small {
  width: 40px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  margin-left: -25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-back-small:first-child {
  margin-left: 0;
}

.card-back-small.vertical {
  width: 56px;
  height: 40px;
  margin-left: 0;
  margin-top: -25px;
}

.opponent-cards.vertical {
  flex-direction: column;
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

.played-cards {
  display: flex;
  gap: 5px;
}

.played-card {
  transform: scale(0.8);
}

.hint {
  color: rgba(255, 255, 255, 0.5);
  font-size: 18px;
}

.dipai {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.dipai h3 {
  margin-bottom: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.dipai-cards {
  display: flex;
  gap: 10px;
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

.action-btn.hint {
  background: rgba(46, 204, 113, 0.5);
}
</style>
