<template>
  <div>
    <div>
      Game: {{ gameIdentifier }}
    </div>
    <player-selection :selection="selection"></player-selection>
    <h3>VS</h3>
    <player-selection :selection="opponentSelection"></player-selection>
    <button v-if="!hasRevealed" @click="reveal">Reveal your choice</button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import PlayerSelection from '@/components/selection/PlayerSelection';

export default {
  components: {
    PlayerSelection
  },
  computed: {
    ...mapState([
      'selection',
      'opponentSelection',
      'hasRevealed',
      'gameIdentifier',
      'account'
    ])
  },
  methods: {
    ...mapActions([
      'reveal'
    ])
  }
}
</script>
