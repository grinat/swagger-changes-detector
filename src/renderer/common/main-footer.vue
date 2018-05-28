<template>
  <v-bottom-nav app fixed class="main-footer" height="30">
    <v-spacer></v-spacer>
    <div class="px-2 py-1">
      {{info.app.name}}: {{info.app.version}} ({{info.platform}})
    </div>
  </v-bottom-nav>
</template>

<script>
  export default {
    name: 'main-footer',
    props: ['app'],
    computed: {
      info () {
        return {
          electron: process.versions['atom-shell'],
          name: this.$route.name,
          node: process.versions.node,
          path: this.$route.path,
          platform: require('os').platform(),
          app: require('../../../package.json'),
          vue: require('vue/package.json').version
        }
      }
    }
  }
</script>

<style>
  .main-footer{
    bottom: 60px!important;
  }
</style>
