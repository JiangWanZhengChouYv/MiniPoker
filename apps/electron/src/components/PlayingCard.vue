<template>
  <div
    class="playing-card"
    :class="{
      selected,
      red: isRed,
      face: !faceDown,
      'face-down': faceDown,
      small: size === 'small',
      large: size === 'large'
    }"
    @click="handleClick"
  >
    <div v-if="faceDown" class="card-back">
      <div class="back-pattern"></div>
    </div>
    <div v-else class="card-front">
      <div class="corner top-left">
        <span class="rank">{{ rankSymbol }}</span>
        <span class="suit">{{ suitSymbol }}</span>
      </div>
      <div class="center-suit" v-if="!isJoker">{{ suitSymbol }}</div>
      <div class="joker-text" v-else>{{ rankSymbol }}</div>
      <div class="corner bottom-right">
        <span class="rank">{{ rankSymbol }}</span>
        <span class="suit">{{ suitSymbol }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Card, Suit } from '@mini-poker/game-core';

interface Props {
  card: Card;
  selected?: boolean;
  faceDown?: boolean;
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  faceDown: false,
  size: 'medium',
  clickable: true
});

const emit = defineEmits<{
  click: [card: Card];
}>();

const rankSymbol = computed(() => props.card.getRankSymbol());
const suitSymbol = computed(() => props.card.getSuitSymbol());
const isRed = computed(() => 
  props.card.suit === Suit.Hearts || props.card.suit === Suit.Diamonds
);
const isJoker = computed(() => props.card.isJoker());

function handleClick() {
  if (props.clickable && !props.faceDown) {
    emit('click', props.card);
  }
}
</script>

<style scoped>
.playing-card {
  position: relative;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
}

.playing-card.medium {
  width: 70px;
  height: 100px;
}

.playing-card.small {
  width: 50px;
  height: 72px;
}

.playing-card.large {
  width: 90px;
  height: 130px;
}

.playing-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.playing-card.selected {
  transform: translateY(-15px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.card-back {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(135deg, #1a5f3a 0%, #2d8659 50%, #1a5f3a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.back-pattern {
  width: 80%;
  height: 80%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(255, 255, 255, 0.1) 5px,
    rgba(255, 255, 255, 0.1) 10px
  );
}

.card-front {
  width: 100%;
  height: 100%;
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.corner {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
}

.corner.top-left {
  align-self: flex-start;
}

.corner.bottom-right {
  align-self: flex-end;
  transform: rotate(180deg);
}

.rank {
  font-size: 16px;
  font-weight: bold;
}

.playing-card.small .rank {
  font-size: 12px;
}

.playing-card.large .rank {
  font-size: 20px;
}

.suit {
  font-size: 16px;
}

.playing-card.small .suit {
  font-size: 12px;
}

.playing-card.large .suit {
  font-size: 24px;
}

.center-suit {
  font-size: 36px;
  text-align: center;
}

.playing-card.small .center-suit {
  font-size: 24px;
}

.playing-card.large .center-suit {
  font-size: 48px;
}

.joker-text {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.playing-card.small .joker-text {
  font-size: 10px;
}

.playing-card.large .joker-text {
  font-size: 18px;
}

.red {
  color: #d32f2f;
}

.playing-card:not(.red) {
  color: #212121;
}
</style>
