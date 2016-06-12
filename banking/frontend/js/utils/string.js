
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

export function dateToSimple(date) {
    return `${date.getFullYear()}-${leftpad(date.getMonth()+1, 0, 2)}`+
        `-${leftpad(date.getDate(),0,2)}`
}
