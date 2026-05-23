import { defineStore } from 'pinia'
import { ref } from 'vue'

interface GameStats {
  totalGames: number
  wins: number
  losses: number
}

export const useStatsStore = defineStore('stats', () => {
  const doudizhu = ref<GameStats>({ totalGames: 0, wins: 0, losses: 0 })
  const guandan = ref<GameStats>({ totalGames: 0, wins: 0, losses: 0 })
  const zhaojinhua = ref<GameStats>({ totalGames: 0, wins: 0, losses: 0 })

  function recordWin(gameType: string) {
    const stats = getStats(gameType)
    stats.totalGames++
    stats.wins++
  }

  function recordLoss(gameType: string) {
    const stats = getStats(gameType)
    stats.totalGames++
    stats.losses++
  }

  function getStats(gameType: string): GameStats {
    switch (gameType) {
      case 'doudizhu':
        return doudizhu.value
      case 'guandan':
        return guandan.value
      case 'zhaojinhua':
        return zhaojinhua.value
      default:
        return { totalGames: 0, wins: 0, losses: 0 }
    }
  }

  function getWinRate(gameType: string): number {
    const stats = getStats(gameType)
    if (stats.totalGames === 0) return 0
    return (stats.wins / stats.totalGames) * 100
  }

  return {
    doudizhu,
    guandan,
    zhaojinhua,
    recordWin,
    recordLoss,
    getWinRate
  }
})
