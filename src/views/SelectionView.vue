<template>
  <div>
    <overlay text="Waiting for opponent..." v-if="selection"></overlay>

    <div>
      <select @change="evt => setAccount(evt.target.value)">
        <option v-for="account in allAccounts" :key="account" :value="account">{{ account }}</option>
      </select>
    </div>

    <rock :selection="selection" @select="select"></rock>
    <paper :selection="selection" @select="select"></paper>
    <scissors :selection="selection" @select="select"></scissors>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

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
      'hasOpponent',
      'allAccounts'
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
    ]),
    ...mapMutations([
      'setAccount'
    ])
  }
}
</script>
