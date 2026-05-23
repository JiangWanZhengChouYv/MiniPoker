<template>
  <div class="settings">
    <div class="header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h1>⚙️ 设置</h1>
      <div class="spacer"></div>
    </div>

    <div class="settings-content">
      <div class="settings-section">
        <h2>🎵 音频设置</h2>
        <div class="setting-item">
          <span class="setting-label">音效</span>
          <div class="toggle-btn" :class="{ active: settings.soundEnabled }" @click="settings.toggleSound()">
            <div class="toggle-circle"></div>
          </div>
        </div>
        <div class="setting-item">
          <span class="setting-label">音乐</span>
          <div class="toggle-btn" :class="{ active: settings.musicEnabled }" @click="settings.toggleMusic()">
            <div class="toggle-circle"></div>
          </div>
        </div>
        <div class="setting-item">
          <span class="setting-label">音量</span>
          <input type="range" class="volume-slider" min="0" max="100" v-model="settings.volume" @input="updateVolume" />
          <span class="volume-value">{{ settings.volume }}%</span>
        </div>
      </div>

      <div class="settings-section">
        <h2>🤖 AI 设置</h2>
        <div class="setting-item">
          <span class="setting-label">难度</span>
          <div class="difficulty-buttons">
            <button
              v-for="d in ['easy', 'medium', 'hard']"
              :key="d"
              class="difficulty-btn"
              :class="{ active: settings.aiDifficulty === d }"
              @click="settings.setDifficulty(d as any)"
            >
              {{ difficultyLabels[d] }}
            </button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2>👤 个人信息</h2>
        <div class="setting-item">
          <span class="setting-label">玩家名称</span>
          <input type="text" class="name-input" v-model="gameStore.playerName" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const settings = useSettingsStore()
const gameStore = useGameStore()

const difficultyLabels: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难'
}

function updateVolume() {
  settings.setVolume(settings.volume)
}

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.settings {
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

.settings-content {
  flex: 1;
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.settings-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-section h2 {
  font-size: 18px;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.9);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 16px;
}

.toggle-btn {
  width: 50px;
  height: 26px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.toggle-circle {
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.3s ease;
}

.toggle-btn.active .toggle-circle {
  left: 26px;
}

.volume-slider {
  flex: 1;
  margin: 0 20px;
  -webkit-appearance: none;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
}

.volume-value {
  width: 50px;
  text-align: right;
  color: rgba(255, 255, 255, 0.7);
}

.difficulty-buttons {
  display: flex;
  gap: 10px;
}

.difficulty-btn {
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: white;
  transition: all 0.3s ease;
  border: none;
  font-size: 14px;
}

.difficulty-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.difficulty-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.name-input {
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: white;
  font-size: 14px;
  outline: none;
  width: 200px;
}

.name-input:focus {
  border-color: #667eea;
}
</style>
