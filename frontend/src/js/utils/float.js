export function fixFloat(value, size) {
    let out
    let parts = (""+value).split('.')

    out = parseInt(parts[0])

    out += (parts[1] !== undefined ? '.'+parts[1]:'')

    out = out.match(/^\d+\.?\d*/)
    if (out) {
        out = out.toString(0)
        // append or cut to given size
        // if (size) {
        //     let match = out.match(/^\d+\./) // is float with dot
        //     let pad
        //     if (match) pad = [0].length
        //     return out.substring(0, pad+size)
        // }
        return out
    }
    else {

        return '0'
    }
}
