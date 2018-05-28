<template>
  <v-form ref="form" v-model="formValid">
    <v-text-field
      v-model="form['name']"
      label="Name"
      :counter="5"
      :rules="rules"
      required
    ></v-text-field>
    <v-text-field
      v-model="form['url']"
      label="Url"
      placeholder="http://site.com/api/v1/doc/api"
      :counter="5"
      :rules="rules"
      required
    ></v-text-field>
    <v-text-field
      v-model="form['UIUrl']"
      label="UI url"
      @focus="() => UIFocus = true"
      placeholder="http://petstore.swagger.io/?url=http://site.com/api/v1/doc/api"
      :counter="5"
      :rules="rules"
      required
    ></v-text-field>
  </v-form>
</template>

<script>
  import {SCHEME} from "./models/types"

  export default {
    name: 'scheme-update',
    title: 'Edit item',
    data: () => ({
      rules: [
        v => !!v || 'is required',
        v => (v && v.length >= 5) || 'must be than 5 characters'
      ],
      formValid: true,
      swaggerUIFocus: false,
      form: {
        _id: null,
        url: '',
        name: '',
        UIUrl: '',
        lastUpdateAt: 0,
        lastChangesAt: 0,
        lastChanges: {}
      }
    }),
    watch: {
      'form': {
        handler: 'onFormChange',
        deep: true
      }
    },
    navbar: function () {
      return {
        buttons: this.buttons
      }
    },
    computed: {
      buttons () {
        return [
          {
            icon: 'save',
            loading: this.waiting,
            click: this.saveForm
          }
        ]
      },
      autoFillUiUrl () {
        return this.form.url && !this.UIFocus && !this.$route.params.id
      },
      item () {
        if (this.$route.params.id) {
          return this.$store.getters.getDoc(SCHEME, this.$route.params.id)
        }
        return null
      }
    },
    methods: {
      onFormChange () {
        if (this.autoFillUiUrl && this.form.url) {
          this.form.UIUrl = `http://petstore.swagger.io/?url=${this.form.url}`
        }
      },
      saveForm: async function () {
        this.waiting = true
        if (this.$refs.form.validate()) {
          try {
            const {id} = await this.$store.dispatch('put', {
              type: SCHEME,
              doc: Object.assign({}, this.form)
            })
            await this.$store.dispatch('updateScheme', {docId: id})
            this.$router.push({
              name: 'schema.schemes.view',
              params: {
                id
              }
            })
          } catch (e) {
            this.$snack.show(e)
          }
        }
        this.waiting = false
        return true
      }
    },
    mounted () {
      if (this.item) {
        this.form = Object.assign({}, this.item.doc)
      }
    },
    asyncData ({store}) {
      return store.dispatch('allDocs', {type: SCHEME})
    }
  }
</script>
