<template>
  <selection :image="require('@/assets/rock.jpg')" :disabled="!!selection" :selected="selection === 'rock'" alt="Rock" @click="onClick">
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
      this.$emit('select', 'rock');
    }
  }
}
</script>
