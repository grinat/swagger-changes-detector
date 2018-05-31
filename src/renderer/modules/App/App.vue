<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'swagger-dev-changes-detector',
    mounted () {
      // hide app splash
      if (document.getElementById('app-bootstrap')) {
        window.requestAnimationFrame(() => {
          document.getElementById('app-bootstrap').style.display = 'none'
        })
      }
    }
  }
</script>
