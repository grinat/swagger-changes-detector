<template>
  <v-app :class="`main-layout light route-${layoutCssClass}`">
    <main-nav app></main-nav>
    <v-content app>
      <v-container fluid>
        <s-error v-if="error" :error="error"></s-error>
        <router-view v-else></router-view>
      </v-container>
    </v-content>
    <main-footer app></main-footer>
  </v-app>
</template>

<script>
  import SError from "../components/error/error";
  import MainNav from "./main-nav";
  import MainFooter from "./main-footer";

  export default {
    components: {
      MainFooter,
      MainNav,
      SError
    },
    name: 'main-layout',
    computed: {
      layoutCssClass() {
        return this.$route.name.split('.').join('-')
      },
      error() {
        return this.$store.getters.getError(this.$route.name)
      }
    }
  }
</script>
