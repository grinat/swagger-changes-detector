<template>
  <v-card class="diff-viewer">
    <slot name="header"></slot>

    <div v-for="item, key in preparedDiff" :class="key" :key="key">
      <v-card-title :key="key">
        <h3>{{key}} ({{item.length}})</h3>
      </v-card-title>
      <div>
        <v-expansion-panel>
          <v-expansion-panel-content
            v-for="row, index in item" :key="index"
            :hide-actions="!row.message"
          >
            <div slot="header">{{row.shortDesc}}</div>
            <v-card v-if="row.message">
              <v-card-text v-html="row.message"></v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
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
    },
    computed: {
      preparedDiff () {
        const origin = this.diff
        const transform = {}
        const maxShortDescLen = 200
        for (let key in origin) {
          transform[key] = origin[key].map(({ruleId, message, previousDescription, currentDescription, descriptionPath}) => {
            let changedMsg = message
            if (ruleId === "edit-description") {
              const { added, removed } = this.getDiffOfDesc(previousDescription, currentDescription)
              changedMsg = `${descriptionPath} - Description changed\n`
              if (added.length > 0) {
                changedMsg += `\nAdded:\n${added.join("\n")}\n`
              }
              if (removed.length > 0) {
                changedMsg += `\nRemoved:\n${removed.join("\n")}\n`
              }
              changedMsg += `\nInformation:\n${message}`
            }
            let shortDesc = `${ruleId} ${message}`.substring(0, maxShortDescLen)
            changedMsg = changedMsg.split("\n").join("<br>")
            if (message.length > maxShortDescLen) {
              shortDesc += '...'
            } else {
              changedMsg = null
            }
            return {message: changedMsg, ruleId, shortDesc}
          })
        }
        return transform
      }
    },
    methods: {
      getDiffOfDesc (previousDescription, currentDescription) {
        const added = []
        const removed = []
        const curr = currentDescription.split("\n")
        const prev = previousDescription.split("\n")
        curr.forEach(str => {
          if (prev.includes(str) === false) {
            added.push(str)
          }
        })
        prev.forEach(str => {
          if (curr.includes(str) === false) {
            removed.push(str)
          }
        })
        return {added, removed}
      }
    }
  }
</script>

<style>
  .diff-viewer .expansion-panel{
    box-shadow: none;
    -webkit-box-shadow: none;
  }
</style>
