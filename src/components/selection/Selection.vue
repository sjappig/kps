<template>
  <img :alt="alt" :src="image" @click="onClick">
</template>

<script>

export default {
  props: ['alt', 'image'],
  methods: {
    async onClick() {
      this.$emit('click');
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
