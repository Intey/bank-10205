import { Types } from '../action.types.js'

export default function error(state = false, action) {
    switch(action.type) {
        case Types.SAVE_FAILURE:        return true
        default:                        return false
    }
}
