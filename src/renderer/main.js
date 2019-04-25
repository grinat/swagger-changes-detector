import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import App from './modules/App/App.vue'
import router from './router'
import store from './stores/store'

Vue.use(Vuetify)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

import Snack from './components/snack/snack.vue'
const snack = Vue.prototype.$snack = new Vue(Snack).$mount()
document.body.appendChild(snack.$el)

import Bar from './components/loader/bar'
const bar = Vue.prototype.$bar = new Vue(Bar).$mount()
document.body.appendChild(bar.$el)

import navbarMixin from './mixins/navbar-mixin'
Vue.mixin(navbarMixin)

import {timeFormat} from './filters/time.js'
Vue.filter('timeFormat', timeFormat)

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const {asyncData} = this.$options
    bar.start()
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to,
        fromRoute: from,
        methods: this,
        ctx: this
      }).then(() => {
        this.$store.commit('mutateError', {name: to.name, error: null})
        bar.finish()
        next()
      }).catch(() => {
        bar.finish()
        next()
      })
    } else {
      this.$store.commit('mutateError', {name: to.name, error: null})
      bar.finish()
      next()
    }
  }
})

router.beforeResolve((to, from, next) => {
  const matched = router.getMatchedComponents(to)
  const prevMatched = router.getMatchedComponents(from)
  let diffed = false
  const activated = matched.filter((c, i) => {
    return diffed || (diffed = (prevMatched[i] !== c))
  })
  if (!activated.length) {
    return next()
  }

  if (!activated.length) {
    return next()
  }
  bar.start()

  Promise.all(activated.map(c => {
    if (c.asyncData) {
      bar.start()
      return c.asyncData({store, route: to, fromRoute: from, methods: c.methods, ctx: c})
    }
    return Promise.resolve(1)
  })).then(() => {
    store.commit('mutateError', {name: to.name, error: null})
    bar.finish()
    next()
  }).catch(() => {
    bar.finish()
    next()
  })
})

if (process.env.NODE_ENV === 'production') {
  Vue.config.errorHandler = (err) => {
    console.error(err)
    snack.show(err)
  }
}

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
