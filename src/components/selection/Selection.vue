<template>
  <img :alt="alt" :src="image" @click="onClick" :class="{ disabled, selected }">
</template>

<script>

export default {
  props: ['alt', 'disabled', 'image', 'selected'],
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
  margin: 1px;
}

img.disabled {
  opacity: 0.5;
}

img:not(.disabled):hover {
  box-shadow: 0 0 2px 1px black;
}

img.selected {
  box-shadow: 0 0 2px 1px black;
}
</style>
