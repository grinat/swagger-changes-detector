<template>
  <v-toolbar color="grey darken-1" dark fixed app>
    <v-toolbar-title>{{title}}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat :to="{name: 'schema.schemes'}">
        Shemes
      </v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-btn
      v-for="button, index in buttons"
      :key="index"
      icon
      flat
      :loading="button.loading"
      @click.stop.prevent="button.click"
    >
      <v-icon>{{button.icon}}</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
  export default {
    name: 'main-nav',
    props: ['app'],
    computed: {
      navbar () {
        return this.$store.getters.navbar
      },
      title () {
        if (this.navbar && this.navbar.title) {
          return this.navbar.title
        }
        return ' - '
      },
      buttons () {
        if (this.navbar && this.navbar.buttons) {
          return this.navbar.buttons
        }
        return []
      }
    }
  }
</script>
