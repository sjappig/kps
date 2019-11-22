<template>
  <div>
    <overlay :text="resultDescription" v-if="hasRevealed"></overlay>
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
import Overlay from '@/components/overlay/Overlay';

export default {
  components: {
    PlayerSelection,
    Overlay
  },
  computed: {
    ...mapState([
      'selection',
      'opponentSelection',
      'hasRevealed',
      'gameIdentifier',
      'account',
      'result'
    ]),
    resultDescription() {
      if (this.result === 'winner') {
        return 'You win!';
      }
      if (this.result === 'loser') {
        return 'You lose';
      }
      if (this.result === 'tie') {
        return 'Tie';
      }
      return 'Waiting for result...';
    }
  },
  methods: {
    ...mapActions([
      'reveal'
    ])
  }
}
</script>
