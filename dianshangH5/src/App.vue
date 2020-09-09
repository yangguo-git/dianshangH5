<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  data(){
    return{

    }
  },
  created(){
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        WeixinJSBridge.call('hideOptionMenu');
    });
  }
  
}
</script>

<style>
html{
  height: 100%;
  background-color: #f6f6f6;
}
body{
  min-width: 320px;
  -webkit-tap-highlight-color: transparent;
  font-family: "Lucida Grande", Verdana, "Microsoft Yahei", STXihei, hei;
  margin: 0;
  padding: 0px;
}
#app{
  height: 100%;
}
</style>
