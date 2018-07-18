<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'swagger-dev-changes-detector',
    mounted () {
      // TODO https://github.com/trodi/electron-splashscreen
      // hide app splash
      if (document.getElementById('app-bootstrap')) {
        setTimeout(() => {
          document.getElementById('app-bootstrap').style.display = 'none'
        }, 2000)
      }
    }
  }
</script>
