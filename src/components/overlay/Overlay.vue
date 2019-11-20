<template>
  <div class="overlay">
    <h1 class="overlay-text">{{ text }}</h1>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['text']
}
</script>

<style scoped>
.overlay {
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 2;
  cursor: pointer;
}

.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 50px;
  color: black;
  transform: translate(-50%,-50%);
}
</style>
