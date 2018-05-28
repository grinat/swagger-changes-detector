import {docSortComparator} from "../../utils/db-helper"

export default {
  getDoc: state => (type, id) => {
    if (id && state.db[type]) {
      const index = state.db[type].findIndex(v => v.id === id)
      if (index > -1) {
        return state.db[type][index]
      }
    }
    return null
  },
  getDocs: state => (type, options = {}) => {
    if (state.db[type]) {
      let rows = state.db[type].slice()
      if (options.$filter) {
        for (let key in options.$filter) {
          rows = rows.filter(v => v.doc[key] === options.$filter[key])
        }
      }
      if (options.$orderby) {
        for (let key in options.$orderby) {
          let sortFunc = docSortComparator(key, options.$orderby[key])
          rows.sort(sortFunc)
        }
      }
      return rows
    }
    return null
  },
  navbar: state => {
    return state.navbar
  },
  getError: state => (name) => {
    if (!state._error[name]) {
      return null
    }
    if (!state._error[name].error) {
      return null
    }
    let error = state._error[name].error
    let formatError = {title: 'Ошибка', message: '', apiUrl: ''}
    if (error.response) {
      // http headers
      if (error.response.status) {
        formatError.title = error.response.status
      }
      if (error.response.statusText) {
        formatError.title = formatError.title + ' ' + error.response.statusText
      }
      if (error.response.message) {
        formatError.message = error.response.message
      } else {
        formatError.message = error.message
      }
      // yii2 message
      if (error.response.data) {
        if (error.response.data.message) {
          formatError.message = error.response.data.message
        }
      }
      // req params
      if (error.response.request && error.response.request.responseURL) {
        formatError.apiUrl = error.response.request.responseURL
      }
    } else {
      formatError.message = error.message
    }

    if (formatError.message === 'Network Error') {
      formatError.message = 'No internet or server connection'
    }
    return formatError
  }
}
