import { Types } from './action.types.js'

export function snackbar(state = { open:false, message: ""}, action) {
    switch(action.type) {
        case Types.REQ_START:
        case Types.CLOSE_BAR:
            return { open: false, message: "" }
        case Types.REQ_SUCCESS:
            return { open: true, message: action.payload }
        case Types.REQ_FAILURE:
            return {
                open: true,
                message: `Error when create event: ${JSON.stringify(action.payload)}` }
        default:
            return state
    }
}

