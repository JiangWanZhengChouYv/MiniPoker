import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const soundEnabled = ref(true)
  const musicEnabled = ref(true)
  const volume = ref(70)
  const aiDifficulty = ref<'easy' | 'medium' | 'hard'>('medium')

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
  }

  function toggleMusic() {
    musicEnabled.value = !musicEnabled.value
  }

  function setVolume(value: number) {
    volume.value = value
  }

  function setDifficulty(difficulty: 'easy' | 'medium' | 'hard') {
    aiDifficulty.value = difficulty
  }

  return {
    soundEnabled,
    musicEnabled,
    volume,
    aiDifficulty,
    toggleSound,
    toggleMusic,
    setVolume,
    setDifficulty
  }
})
