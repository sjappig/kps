<template>
  <div class="kps">
    <h1>Select rock, paper or scissors</h1>
    <img v-if="selection === undefined || selection === 'rock'" alt="Rock" src="../assets/rock.jpg" @click="rock">
    <img v-if="selection === undefined || selection === 'paper'" alt="Paper" src="../assets/paper.jpg" @click="paper">
    <img v-if="selection === undefined || selection === 'scissors'" alt="Scissors" src="../assets/scissors.jpg" @click="scissors">
    <button :disabled="gameIdentifier === undefined" @click="reveal">Reveal</button>
  </div>
</template>

<script>
import KPSContract from '../services/KPSContract';

export default {
  name: 'Rock-paper-scissors',
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
img {
  width: 25%;
  border-radius: 50%;
}

img:hover {
  box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);
}

</style>
