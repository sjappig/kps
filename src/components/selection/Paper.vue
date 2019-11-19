<template>
  <selection :image="require('@/assets/paper.jpg')" :disabled="!!selection" :selected="selection === 'paper'" alt="Paper" @click="onClick">
  </selection>
</template>

<script>
import Selection from '@/components/selection/Selection.vue';

export default {
  components: {
    Selection
  },
  props: ['selection'],
  methods: {
    async onClick() {
      this.$emit('select', 'paper');
    }
  }
}
</script>
