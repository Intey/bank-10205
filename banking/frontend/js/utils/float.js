export function fixFloat(value, size) {
    let out
    let parts = value.split('.')

    out = parseInt(parts[0])

    out += (parts[1] !== undefined ? '.'+parts[1]:'')

    out = out.match(/^\d+\.?\d*/)
    if (out) {
        out = out.toString(0)
        if (size) {
            let pad = out.match(/^\d+\./)[0].length
            return out.substring(0, pad+size)
        }
        return out
    }
    else return '0'
}
