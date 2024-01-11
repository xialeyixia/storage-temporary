<template>
  <router-view />
</template>

<style lang="scss">
#app {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family:
    PingFang SC,
    Avenir,
    Helvetica,
    Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.warning-message {
  color: #747474;
  font-size: 15px;
  display: inline-block;
  vertical-align: middle;
  white-space: pre-wrap;
}
</style>
