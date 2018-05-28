import axios from 'axios'
import store from '../stores/store/index'
import router from '../router/index'
import {apiState} from '../stores/api/api.js'

axios.defaults.timeout = 100000
axios.interceptors.response.use(function (response) {
  const name = apiState.getNameByUrl(response.config.url)
  store.commit('mutateError', {name: name, error: null})
  return response
}, function (error) {
  let disableErrorHandler = false
  if (error.response && error.response.config && error.response.config.disableGlobalError === true) {
    disableErrorHandler = true
  }

  if (error.response) {
    const name = apiState.getNameByUrl(error.response.config.url)
    if (error.config && error.config.method === 'get') {
      const name = apiState.getNameByUrl(error.config.url)
      disableErrorHandler === false && store.commit('mutateError', {name: name, error: error})
    }
  } else {
    console.error('unknow error', error)
    disableErrorHandler === false && store.commit('mutateError', {name: 'all', error: error})
  }
  return Promise.reject(error)
})

export default class api {

  static get (url, options = {}) {
    let routeName = '_'
    if (router.history.pending) {
      routeName = router.history.pending.name
    } else if (router.history.current) {
      routeName = router.history.current.name
    }
    apiState.addNewUrl(routeName, url)
    return axios.get(url, options)
  }

}
