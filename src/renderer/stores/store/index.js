import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  /* https://vuex.vuejs.org/en/strict.html */
  strict: process.env.NODE_ENV !== 'production'
})
