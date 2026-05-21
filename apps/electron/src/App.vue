<template>
  <div class="app">
    <GameLobby v-if="!gameStore.isGameActive" />
    <DouDiZhuGame v-else-if="gameStore.currentGameType === 'doudizhu'" />
    <MultiplayerLobby v-else-if="gameStore.currentGameType === 'multiplayer' && !multiplayerStore.isInRoom" />
    <RoomView v-else-if="gameStore.currentGameType === 'multiplayer' && multiplayerStore.isInRoom" />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from './stores/game';
import { useMultiplayerStore } from './stores/multiplayer';
import GameLobby from './views/GameLobby.vue';
import DouDiZhuGame from './views/DouDiZhuGame.vue';
import MultiplayerLobby from './views/MultiplayerLobby.vue';
import RoomView from './views/RoomView.vue';

const gameStore = useGameStore();
const multiplayerStore = useMultiplayerStore();
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.app {
  min-height: 100vh;
}
</style>
