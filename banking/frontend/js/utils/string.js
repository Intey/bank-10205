
export function leftpad(str, ch, size) {
    if (!str && !ch && !size) return ''
    const s = `${str}`
    const pad_size = size - s.length

    var pad_ch = `${ch}` || ' '
    var pad = ''

    while(pad.length < pad_size) {
        const cnt = pad_size - pad.length
        if (cnt <= pad_ch.length) {
            pad += pad_ch.slice(0, cnt)
            break;
        }
        pad += pad_ch
    }
    return `${pad}${s}`
}

/** * Convert Date object to string format YYYY-MM-DD */
export function dateToSimple(date) {
  return date.getFullYear()
    + '-' + leftpad(date.getMonth()+1, 0, 2) // (+1): January is 0 in Date object
    + '-' + leftpad(date.getDate(),0,2)
}

/** * Convert string format YYYY-MM-DD to Date object */
export function dateFromSimple(date) {
  const parts = date.split('-')
  var d = new Date()
  d.setYear(parts[0])
  d.setMonth(parts[1]-1)
  d.setDate(parts[2])
  return d
}
