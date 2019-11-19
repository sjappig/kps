<template>
  <div class="kps">
    <h1>Select rock, paper or scissors</h1>
    <rock :selection="selection" @select="select"></rock>
    <paper :selection="selection" @select="select"></paper>
    <scissors :selection="selection" @select="select"></scissors>
    <button :disabled="gameIdentifier === undefined" @click="reveal">Reveal</button>
  </div>
</template>

<script>
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
  data: function() {
    return {
      selection: undefined,
      gameEndedSubscription: undefined,
      nonce: undefined,
      gameIdentifier: undefined
    }
  },
  methods: {
    async select(selection) {
      if (this.selection !== undefined) {
        return;
      }
      this.selection = selection;
      await KPSContract.select(selection, this.gameStarted, this.gameEnded);
    },
    gameStarted(gameIdentifier, nonce, gameEndedSubscription) {
      this.gameIdentifier = gameIdentifier;
      this.nonce = nonce;
      this.gameEndedSubscription = gameEndedSubscription;
    },
    gameEnded(opponentResult) {
      // eslint-disable-next-line
      console.log(opponentResult);
    },
    async reveal() {
      this.gameEndedSubscription.unsubscribe();
      const result = await KPSContract.reveal(this.gameIdentifier, this.nonce, this.selection);
      // eslint-disable-next-line
      console.log(result);
    }
  }
}
</script>

<style scoped>
</style>
