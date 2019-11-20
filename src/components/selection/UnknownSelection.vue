<template>
  <selection :image="require('@/assets/unknown.png')" :disabled="true" :selected="true" alt="Unknown">
  </selection>
</template>

<script>
import Selection from '@/components/selection/Selection';

export default {
  components: {
    Selection
  }
}
</script>
