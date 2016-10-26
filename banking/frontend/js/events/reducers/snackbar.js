import { Types } from '../action.types.js'

export function snackbar(state = { open:false, message: ""}, action) {
    switch(action.type) {
        case Types.SAVE_REQUEST:
        case 'CLOSE_SNACK':
            return { open: false, message: "" }
        case Types.SAVE_SUCCESS:
            return { open: true, message: action.payload }
        case Types.SAVE_FAILURE:
            return {
                open: true,
                message: `Error when create event: ${JSON.stringify(action.payload)}` }
        default:
            return state
    }
}

