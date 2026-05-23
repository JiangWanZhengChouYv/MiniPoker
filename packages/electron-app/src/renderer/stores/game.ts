import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const currentGame = ref<string | null>(null)
  const isPlaying = ref(false)
  const playerName = ref('玩家')
  const isMultiplayer = ref(false)

  function startGame(gameType: string) {
    currentGame.value = gameType
    isPlaying.value = true
  }

  function endGame() {
    currentGame.value = null
    isPlaying.value = false
    isMultiplayer.value = false
  }

  return {
    currentGame,
    isPlaying,
    playerName,
    isMultiplayer,
    startGame,
    endGame
  }
})
