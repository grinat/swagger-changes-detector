export function getNewID () {
  let d = +new Date()
  let r = Math.floor(Math.random() * (900000 - 100000) + 100000)
  return `${d}-${r}`
}
