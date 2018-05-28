<template>
  <v-card class="diff-viewer">
    <slot name="header"></slot>
    <div v-for="item, key in diff" :class="key" :key="key">
      <v-card-title :key="key">
        {{key}} ({{item.length}})
      </v-card-title>
      <v-card-text v-for="row, index in item" :key="index">
        <div>
          <span class="grey--text">{{row.ruleId}}</span>
          <div>{{row.message}}</div>
        </div>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
  export default {
    name: 'diff-viewer',
    props: {
      diff: {
        type: Object,
        default: function () {
          return {}
        }
      }
    }
  }
</script>
