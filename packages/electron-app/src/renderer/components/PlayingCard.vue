<template>
  <div
    class="playing-card"
    :class="{ selected: isSelected, flipped: isFlipped }"
    @click="handleClick"
  >
    <div class="card-face front">
      <div class="card-suit" :class="suitColor">
        <span class="rank">{{ rankDisplay }}</span>
        <span class="suit">{{ suitDisplay }}</span>
      </div>
      <div class="card-center">
        <span class="suit-large">{{ suitDisplay }}</span>
      </div>
      <div class="card-suit bottom-right" :class="suitColor">
        <span class="rank">{{ rankDisplay }}</span>
        <span class="suit">{{ suitDisplay }}</span>
      </div>
    </div>
    <div class="card-face back">
      <div class="card-back-pattern"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  rank: string
  suit: string
  isSelected?: boolean
  isFlipped?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const suitColor = computed(() => {
  return props.suit === '♥' || props.suit === '♦' ? 'red' : 'black'
})

const rankDisplay = computed(() => {
  const ranks: Record<string, string> = {
    '1': 'A',
    '11': 'J',
    '12': 'Q',
    '13': 'K',
    '14': 'A'
  }
  return ranks[props.rank] || props.rank
})

const suitDisplay = computed(() => {
  return props.suit
})

function handleClick() {
  emit('click')
}
</script>

<style scoped>
.playing-card {
  width: 70px;
  height: 100px;
  perspective: 1000px;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease;
}

.playing-card.selected {
  transform: translateY(-20px);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  background: white;
  transition: transform 0.6s;
}

.front {
  transform: rotateY(0deg);
}

.back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.flipped .front {
  transform: rotateY(180deg);
}

.flipped .back {
  transform: rotateY(0deg);
}

.card-suit {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
}

.card-suit.bottom-right {
  transform: rotate(180deg);
  align-self: flex-end;
}

.card-suit .rank {
  font-weight: bold;
}

.card-suit.red {
  color: #e74c3c;
}

.card-suit.black {
  color: #2c3e50;
}

.card-center {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
}

.suit-large {
  font-size: 36px;
}

.card-back-pattern {
  width: 100%;
  height: 100%;
  border: 3px solid #fff;
  border-radius: 5px;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(255,255,255,0.1) 5px,
    rgba(255,255,255,0.1) 10px
  );
}
</style>
