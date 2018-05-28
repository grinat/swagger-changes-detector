import Vue from 'vue'
import {getNewID} from "../../utils/num-helper"

const request = request || {
  senders: {},
  listeners: {},
  send: function (action, data = {}) {
    return new Promise((resolve, reject) => {
      data._queueId = this._addToQueue(resolve, reject)
      this._startListen(action)
      Vue.prototype.$electron.ipcRenderer.send(action, data)
    })
  },
  _startListen: function (action) {
    if (!this.listeners.hasOwnProperty(action)) {
      this.listeners[action] = this._listen
      Vue.prototype.$electron.ipcRenderer.on(action, this.listeners[action])
    }
  },
  _listen: function (event, data) {
    if (data && data._queueId) {
      const sender = request.senders[data._queueId]
      if (data.error) {
        sender.onFail(data.error)
      } else {
        sender.onSuccess(data)
      }
    }
  },
  _addToQueue: function (resolve, reject) {
    const id = getNewID()
    this.senders[id] = {
      onSuccess: resolve,
      onFail: reject
    }
    return id
  }
}

export default request
