<template>
  <div class="kps">
    <h1>Select rock, paper or scissors</h1>
    <selection :image="require('@/assets/rock.jpg')" alt="Rock" @click="rock"></selection>
    <selection :image="require('@/assets/paper.jpg')" alt="Paper" @click="paper"></selection>
    <selection :image="require('@/assets/scissors.jpg')" alt="Scissors" @click="scissors"></selection>
    <button :disabled="gameIdentifier === undefined" @click="reveal">Reveal</button>
  </div>
</template>

<script>
import KPSContract from '@/services/KPSContract';
import Selection from '@/components/selection/Selection.vue';

export default {
  components: {
    Selection,
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
    async rock() {
      await this.select('rock');
    },
    async paper() {
      await this.select('paper');
    },
    async scissors() {
      await this.select('scissors');
    },
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
