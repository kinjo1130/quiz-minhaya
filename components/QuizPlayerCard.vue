<template>
  <div class="player-card">
    <div class="player-card__icon">
      <p v-if="player.state === 'neutral'">
        🤔
      </p>
      <p v-if="player.state === 'respondent'">
        🖐
      </p>
      <p v-if="player.state === 'correct'">
        ⭕
      </p>
      <p v-if="player.state === 'incorrect'">
        ✖
      </p>
    </div>
    <div>
      <p class="player-card__player-name">
        {{ player.name }}
      </p>
      <p>正答数: {{ player.score }}問</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { QuizPlayer } from '~/types'

interface Props {
  player: QuizPlayer
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.player-card {
  display: flex;
  flex-direction: row;
  align-items: center;

  &__icon {
    font-size: 3rem;
  }

  &__player-name {
    font-size: 1.5rem;
  }

  p {
      margin: 0;
    }
}
</style>
