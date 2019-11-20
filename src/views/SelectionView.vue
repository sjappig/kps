<template>
  <div class="kps">
    <h1>Select rock, paper or scissors</h1>
    <rock :selection="selection" @select="select"></rock>
    <paper :selection="selection" @select="select"></paper>
    <scissors :selection="selection" @select="select"></scissors>
    <button :disabled="gameIdentifier === undefined">Reveal</button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import KPSContract from '@/services/KPSContract';
import Rock from '@/components/selection/Rock';
import Paper from '@/components/selection/Paper';
import Scissors from '@/components/selection/Scissors';

export default {
  components: {
    Rock,
    Paper,
    Scissors
  },
  mounted() {
    KPSContract.initialise();
  },
  computed: {
    ...mapState([
      'selection',
      'gameIdentifier'
    ])
  },
  methods: {
    ...mapActions([
      'select'
    ])
  }
}
</script>
