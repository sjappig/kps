<template>
  <div>
    <unknown-selection v-if="!selection" ></unknown-selection>
    <rock v-if="selection === 'rock'" :selection="selection"></rock>
    <paper v-if="selection === 'paper'" :selection="selection"></paper>
    <scissors v-if="selection === 'scissors'" :selection="selection"></scissors>
  </div>
</template>

<script>
import Rock from '@/components/selection/Rock';
import Paper from '@/components/selection/Paper';
import Scissors from '@/components/selection/Scissors';
import UnknownSelection from '@/components/selection/UnknownSelection';

export default {
  props: ['selection'],
  components: {
    Rock,
    Paper,
    Scissors,
    UnknownSelection
  }
}
</script>
