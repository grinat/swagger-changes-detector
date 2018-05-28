export function docSortComparator (key, order = 1) {
  return (a, b) => {
    if (a.doc[key] > b.doc[key]) {
      return order
    } else if (a.doc[key] < b.doc[key]) {
      return order * -1
    }
    return 0
  }
}
