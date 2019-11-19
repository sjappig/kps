<template>
  <selection :image="require('@/assets/scissors.jpg')" :disabled="!!selection" :selected="selection === 'scissors'" alt="Scissors" @click="onClick">
  </selection>
</template>

<script>
import Selection from '@/components/selection/Selection';

export default {
  components: {
    Selection
  },
  props: ['selection'],
  methods: {
    async onClick() {
      this.$emit('select', 'scissors');
    }
  }
}
</script>
