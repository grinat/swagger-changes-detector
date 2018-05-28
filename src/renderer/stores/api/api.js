const apiState = apiState || {
  _apiState: [],
  addNewUrl: function (routeName, url) {
    this._apiState.push({name: routeName, url: url})
  },
  getNameByUrl: function (url) {
    let i = this._apiState.length - 1
    let foundName = null
    try {
      for (; i >= 0; i--) {
        if (this._apiState[i].url === url) {
          foundName = this._apiState[i].name
          break
        }
      }
    } catch (e) {
      console.error(e)
    }
    return foundName
  }
}

export {apiState}
