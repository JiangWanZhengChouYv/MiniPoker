<template>
  <div class="game-lobby">
    <div class="lobby-content">
      <h1 class="title">Mini Poker</h1>
      <p class="subtitle">选择你想玩的游戏</p>
      
      <div class="mode-tabs">
        <button 
          class="mode-tab" 
          :class="{ active: currentMode === 'single' }"
          @click="currentMode = 'single'"
        >
          单人模式
        </button>
        <button 
          class="mode-tab" 
          :class="{ active: currentMode === 'multi' }"
          @click="currentMode = 'multi'"
        >
          多人模式
        </button>
      </div>
      
      <div v-if="currentMode === 'single'" class="game-cards">
        <div class="game-card" @click="selectGame('doudizhu')">
          <div class="card-icon">♠♥♦♣</div>
          <h2 class="card-title">斗地主</h2>
          <p class="card-desc">经典三人纸牌游戏</p>
        </div>
        
        <div class="game-card disabled">
          <div class="card-icon">🃏</div>
          <h2 class="card-title">掼蛋</h2>
          <p class="card-desc">即将上线</p>
        </div>
        
        <div class="game-card disabled">
          <div class="card-icon">🎴</div>
          <h2 class="card-title">炸金花</h2>
          <p class="card-desc">即将上线</p>
        </div>
      </div>

      <div v-else class="multiplayer-section">
        <div class="game-card multiplayer-card" @click="goToMultiplayerLobby">
          <div class="card-icon">🌐</div>
          <h2 class="card-title">多人斗地主</h2>
          <p class="card-desc">在线对战，一起打牌！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore, GameType } from '../stores/game';

const gameStore = useGameStore();
const currentMode = ref('single');

function selectGame(type: string) {
  if (type === 'doudizhu') {
    gameStore.selectGameType(GameType.DouDiZhu);
  }
}

function goToMultiplayerLobby() {
  gameStore.selectGameType(GameType.Multiplayer);
}
</script>

<style scoped>
.game-lobby {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lobby-content {
  text-align: center;
  max-width: 1200px;
}

.title {
  font-size: 4rem;
  font-weight: bold;
  color: #e94560;
  margin-bottom: 0.5rem;
  text-shadow: 0 4px 12px rgba(233, 69, 96, 0.4);
}

.subtitle {
  font-size: 1.25rem;
  color: #e0e0e0;
  margin-bottom: 2rem;
}

.mode-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.mode-tab {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  color: #e0e0e0;
  padding: 0.75rem 2rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: bold;
}

.mode-tab:hover {
  background: rgba(255, 255, 255, 0.2);
}

.mode-tab.active {
  background: #e94560;
  color: white;
  border-color: #e94560;
}

.game-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.multiplayer-section {
  margin-top: 2rem;
}

.game-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.game-card:hover:not(.disabled) {
  transform: translateY(-10px);
  border-color: #e94560;
  box-shadow: 0 12px 32px rgba(233, 69, 96, 0.3);
}

.game-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.game-card.multiplayer-card {
  max-width: 400px;
  margin: 0 auto;
}

.game-card.multiplayer-card:hover {
  border-color: #4ade80;
  box-shadow: 0 12px 32px rgba(74, 222, 128, 0.3);
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.75rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.card-desc {
  color: #b0b0b0;
  font-size: 1rem;
}
</style>
