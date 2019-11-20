<template>
  <div>
    <player-selection :selection="selection"></player-selection>
    <h3>VS</h3>
    <player-selection :selection="opponentSelection"></player-selection>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import PlayerSelection from '@/components/selection/PlayerSelection';

export default {
  components: {
    PlayerSelection
  },
  computed: {
    ...mapState([
      'selection',
      'opponentSelection',
    ])
  }
}
</script>
