export default {
  syncDocs: (state, {type, rows}) => {
    state.db[type] = rows
    state.db = Object.assign({}, state.db)
  },
  mutateNavbar: function (state, opt) {
    state.navbar = opt
  },
  mutateError: (state, options) => {
    let {name, error} = options
    let newData = Object.assign({}, state._error)
    let currentTime = +new Date()
    let errorDuration = 200

    // if exist previous error
    if (newData[name] && newData[name].time) {
      if ((newData[name].time + errorDuration) < currentTime) {
        // if error, update time, else reset it
        newData[name] = {
          time: error ? currentTime : 0,
          error: error
        }
        state._error = null
        state._error = newData
      }
    } else if (error) {
      // if new error
      newData[name] = {
        time: currentTime,
        error: error
      }
      state._error = null
      state._error = newData
    }
  }
}
