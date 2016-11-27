import { Types } from '../action.types.js'

export default function fetching(state = false, action) {
    switch(action.type) {
        case Types.SAVE_REQUEST : return true
        case Types.SAVE_SUCCESS : return false
        case Types.SAVE_FAILURE : return false
        default                 : return state
    }
}
