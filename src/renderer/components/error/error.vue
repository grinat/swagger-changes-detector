<template>
  <div v-if="error" class="s-error content">
    <div class="flex xs12">
      <div class="center mt-5 pt-5">
        <h1 class="display-2">{{error.title}}</h1>
        <div v-if="error.message" v-html="error.message"></div>
        <div v-if="error.apiUrl">
          URL api вызвавший ошибку: {{error.apiUrl}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 's-error',
    props: ['error'],
  }
</script>

<style>
  .s-error {
    text-align: center;
  }
  .s-error div{
    display: block;
  }
</style>
