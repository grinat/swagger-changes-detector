import moment from 'moment'

export function timeFormat (unixTime, format, specialOptions) {
  // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Date
  let date = new Date(+unixTime)
  let convertedDate = ''

  if (format === 'dayDuration') {
    let duration = Math.floor((+new Date() - unixTime * 1000) / 1000 / 24 / 3600)
    return `${duration} days`
  } else if (format !== undefined) {
    convertedDate = moment(date).format(format)
    return convertedDate
  }
  convertedDate = moment(date).fromNow()
  return convertedDate
}
