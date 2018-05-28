<template>
  <div class="s-snack application light theme--light application--touch-support">
    <v-snackbar
      :top="position === 'top'"
      :bottom="position === 'bottom'"
      :right="position === 'right'"
      :left="position === 'left'"
      :multi-line="multiLine"
      v-model="active">
      <div v-html="message"></div>
      <v-btn flat color="pink" @click.native="active = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    name: 's-snackbar',
    data () {
      return {
        active: false,
        message: null,
        duration: 0,
        position: 'bottom',
        multiLine: false
      }
    },
    methods: {
      show (e, multiLine = true, duration = 13000, position = 'bottom') {
        this.multiLine = multiLine
        this.duration = duration
        this.position = position
        try {
          let msg = ''
          console.log(e)
          if (e && e.response && e.response.data && e.response.data.message) {
            msg += e.response.data.message.toString()
          } else if (e && e.response && e.response.data) {
            for (let key in e.response.data) {
              if (e.response.data[key].message) {
                msg += e.response.data[key].message + ' '
              } else {
                msg += e.response.data[key].toString() + ' '
              }
            }
          } else if (e && e.hasOwnProperty('name')) {
            msg = `${e.status || ''} ${e.name || ' - '} ${e.message || ' - '}`
          } else {
            msg = e.toString()
          }
          if (msg && msg.length > 100) {
            this.message = msg.substring(0, 100) + '...'
          } else {
            this.message = msg
          }
        } catch (er) {
          this.message = 'Unknown error'
        }
        this.active = true
      }
    }
  }
</script>

<style>
  .s-snack .snack__content{
    word-wrap: break-word;
    word-break: break-all;
  }
</style>
