<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import "assets/css/reset.css";
@import "assets/font/iconfont.css";
html, body {
  height: 100%;
  width: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*height: 100%;*/
}
.height_100 {
  /*height: 100%;*/
}
.cell{
  text-align: center;
}
.edui1_toolbarbox,.edui1_iframeholder{
  width: 100%;
}
</style>
