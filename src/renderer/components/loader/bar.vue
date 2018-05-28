<template>
  <div class="g-bar" v-if="loading">
    <v-progress-circular
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
  export default {
    name: 'g-bar',
    data: () => ({
      loading: false
    }),
    methods: {
      start() {
        this.loading = true
      },
      finish () {
        this.loading = false
      }
    }
  }
</script>

<style>
  .g-bar{
    position: fixed;
    top: 0;
    width: 100%;
    text-align: center;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    z-index: 500;
  }

  .g-bar .progress-circular{
    margin-top: 150px;
  }
</style>

