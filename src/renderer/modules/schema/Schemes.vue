<template>
  <div class="schema schemes">
    <v-list v-if="items && items.length" two-line>
      <template v-for="(item, index) in items">
        <v-list-tile
          :key="item.id"
          avatar
          ripple
          @click="viewItem(item)"
        >
          <v-list-tile-content>
            <v-list-tile-title>
              {{item.doc.name}} ({{item.doc.url}})
            </v-list-tile-title>
            <v-list-tile-sub-title class="text--primary">
              Last changes: {{item.doc.lastChangesAt | timeFormat(dateFormat)}} ({{item.doc.lastChangesAt | timeFormat}})
            </v-list-tile-sub-title>
            <v-list-tile-sub-title>
              Last update: {{item.doc.lastUpdateAt | timeFormat(dateFormat)}} ({{item.doc.lastUpdateAt | timeFormat}})
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn flat icon @click.stop.prevent="editItem(item)">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn flat icon @click.stop.prevent="deleteItem(item)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
      </template>
    </v-list>
    <div v-else>
      No data
    </div>
  </div>
</template>

<script>
  import {DATE_FORMAT} from "../../config/main"
  import {SCHEME, SCHEME_DOWNLOAD} from "./models/types"

  export default {
    name: 'schemes',
    title: 'Schemes',
    navbar: function () {
      return {
        buttons: this.buttons
      }
    },
    computed: {
      dateFormat () {
        return DATE_FORMAT
      },
      buttons () {
        return [
          {
            icon: 'add',
            click: () => this.$router.push({
              name: 'schema.schemes.create'
            })
          },
          {
            icon: 'refresh',
            loading: this.waiting,
            click: this.refreshAllScheme
          }
        ]
      },
      items () {
        return this.$store.getters.getDocs(SCHEME, {
          $orderby: {
            lastChangesAt: -1
          }
        })
      }
    },
    methods: {
      refreshAllScheme: async function () {
        this.$bar.start()
        try {
          let rows = this.items.slice()
          for (let i = 0; i < rows.length; i++) {
            await this.$store.dispatch('updateScheme', {
              docId: rows[i].id
            })
          }
        } catch (e) {
          this.$snack.show(e)
        }
        this.$bar.finish()
        return true
      },
      deleteItem (item) {
        this.$electron.remote.dialog.showMessageBox(
          {
            buttons: ['Yes', 'No'],
            title: 'Delete item?'
          },
          (r) => {
            if (r === 0) {
              this.removeItemWithRelations(item)
            }
          }
        )
      },
      removeItemWithRelations: async function (item) {
        this.$bar.start()
        try {
          await this.$store.dispatch('remove', {type: SCHEME, docId: item.id})
          await this.$store.dispatch('removeAll', {
            $filter: {
              type: SCHEME_DOWNLOAD,
              schemaId: item.id
            }
          })
        } catch (e) {
          this.$snack.show(e)
        }
        this.$bar.finish()
        return true
      },
      editItem (item) {
        this.$router.push({
          name: 'schema.schemes.update',
          params: {
            id: item.id
          }
        })
      },
      viewItem (item) {
        this.$router.push({
          name: 'schema.schemes.view',
          params: {
            id: item.id
          }
        })
      }
    },
    asyncData ({store}) {
      return store.dispatch('allDocs', {type: SCHEME})
    }
  }
</script>
