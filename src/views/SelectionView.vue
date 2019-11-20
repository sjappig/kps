<template>
  <div>
    <overlay text="Waiting for opponent..." v-if="selection"></overlay>
    <rock :selection="selection" @select="select"></rock>
    <paper :selection="selection" @select="select"></paper>
    <scissors :selection="selection" @select="select"></scissors>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import Rock from '@/components/selection/Rock';
import Paper from '@/components/selection/Paper';
import Scissors from '@/components/selection/Scissors';

import Overlay from '@/components/overlay/Overlay';

export default {
  components: {
    Rock,
    Paper,
    Scissors,
    Overlay
  },
  computed: {
    ...mapState([
      'selection',
      'gameIdentifier',
      'hasOpponent'
    ])
  },
  watch: {
    hasOpponent() {
      this.$router.push('Reveal');
    }
  },
  methods: {
    ...mapActions([
      'select'
    ])
  }
}
</script>
