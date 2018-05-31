<template>
  <div class="schema scheme">
    <v-flex class="mb-3">
      <v-card v-if="item">
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{item.doc.name}}</h3>
            <div>{{item.doc.url}}</div>
            <div>
              <a
                :href="item.doc.UIUrl"
                @click.stop.prevent="$electron.shell.openExternal(item.doc.UIUrl)"
              >
                {{item.doc.UIUrl}}
              </a>
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <div>
            Last update:
            {{item.doc.lastUpdateAt | timeFormat(dateFormat)}} ({{item.doc.lastUpdateAt | timeFormat}})
          </div>
        </v-card-text>
      </v-card>
      <div v-else>
        Scheme not found
      </div>
    </v-flex>

    <v-flex class="mb-3" v-if="item">
      <diff-viewer :diff="item.doc.lastChanges">
        <v-card-title slot="header">Last changes {{item.doc.lastChangesAt | timeFormat(dateFormat)}} ({{item.doc.lastChangesAt | timeFormat}})</v-card-title>
      </diff-viewer>
    </v-flex>

    <v-flex v-if="item" class="mb-3">
      <v-card>
        <v-card-title>Compare</v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex xs6>
              <v-select
                :items="compareList"
                v-model="form['newItem']"
                label="New"
                single-line
              ></v-select>
            </v-flex>
            <v-flex xs6>
              <v-select
                :items="compareList"
                v-model="form['oldItem']"
                label="Old"
                single-line
              ></v-select>
            </v-flex>
          </v-layout>
          <v-btn flat @click="compareItems()" :loading="comparing">
            Compare
          </v-btn>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex class="mb-3" v-if="compareResult">
      <diff-viewer :diff="compareResult">
        <v-card-title slot="header">Compare results</v-card-title>
      </diff-viewer>
    </v-flex>

    <v-flex class="mb-3">
      <v-list v-if="item && downloads && downloads.length" three-line>
        <v-subheader>Downloads</v-subheader>
        <template v-for="(item, index) in downloads">
          <v-list-tile
            :key="item.id"
            title="Click for open folder with file"
            @click.stop.prevent="openDirWithFile(item.doc.filePath)"
          >
            <v-list-tile-content>
              <v-list-tile-title>
                {{item.doc.createdAt | timeFormat(dateFormat)}} ({{item.doc.createdAt | timeFormat}})
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{item.doc.filePath}}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn flat icon @click.stop.prevent="deleteDownloadItem(item)">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
      <div v-else>
        No data
      </div>
    </v-flex>

  </div>
</template>

<script>
  import DiffViewer from "./components/diff-viewer"
  import {DATE_FORMAT} from "../../config/main"
  import {SCHEME, SCHEME_DOWNLOAD} from "./models/types"

  export default {
    components: {DiffViewer},
    name: 'scheme',
    title: 'Scheme',
    data: () => ({
      comparing: false,
      compareResult: null,
      form: {
        newItem: '',
        oldItem: ''
      }
    }),
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
            icon: 'edit',
            click: () => this.$router.push({
              name: 'schema.schemes.update',
              params: {
                id: this.$route.params.id
              }
            })
          },
          {
            icon: 'refresh',
            loading: this.waiting,
            click: this.refreshScheme
          }
        ]
      },
      item () {
        if (this.$route.params.id) {
          return this.$store.getters.getDoc(SCHEME, this.$route.params.id)
        }
        return null
      },
      downloads () {
        return this.$store.getters.getDocs(SCHEME_DOWNLOAD, {
          $filter: {
            schemaId: this.item.id
          },
          $orderby: {
            createdAt: -1
          }
        })
      },
      compareList () {
        let items = []
        if (this.downloads) {
          this.downloads.forEach(v => {
            items.push({
              text: `${this.$options.filters.timeFormat(v.doc.createdAt, DATE_FORMAT)} (${this.$options.filters.timeFormat(v.doc.createdAt)})`,
              value: v.id
            })
          })
        }
        return items
      }
    },
    methods: {
      openDirWithFile (filePath) {
        this.$electron.shell.showItemInFolder(filePath)
      },
      compareItems () {
        this.comparing = true
        this.$store.dispatch('readDiff', {
          fisrtId: this.form.newItem,
          lastId: this.form.oldItem
        }).then(r => {
          this.comparing = false
          this.compareResult = Object.assign({}, r.diff)
        }).catch(e => {
          this.comparing = false
          this.$snack.show(e)
        })
      },
      deleteDownloadItem (item) {
        this.$bar.start()
        this.$store.dispatch('remove', {
          type: SCHEME_DOWNLOAD, docId: item.id
        }).then(() => {
          this.$bar.finish()
        }).catch(e => {
          this.$snack.show(e)
          this.$bar.finish()
        })
      },
      refreshScheme () {
        this.waiting = true
        this.$store.dispatch('updateScheme', {
          docId: this.$route.params.id
        }).then(() => {
          this.waiting = false
        }).catch(e => {
          this.waiting = false
          this.$snack.show(e)
        })
      }
    },
    asyncData ({store}) {
      let promises = []
      promises.push(store.dispatch('allDocs', {type: SCHEME}))
      promises.push(store.dispatch('allDocs', {type: SCHEME_DOWNLOAD}))
      return Promise.all(promises)
    }
  }
</script>
