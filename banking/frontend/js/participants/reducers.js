import { Types as Action } from './action.types.js'
import { UpdateError } from './errors.js'

export const initialState = {

}

/**
 * Return Event state. Rudux Reducer.
 * @param {Object} state of event
 */
export default function event(state = initialState, action) {
    switch (action.type) {
        case Action.ADD_PARTICIPANT:
            if (state[action.id]) return state
            return { ...state, [action.id]: action.parts }
        case Action.DEL_PARTICIPANT:
            return { ...state, id: action.payload }
        case Action.UPD_PARTS:
            if (!state[action.id])
                throw new UpdateError(`participant ${action.id} doesn't exists`)
            return { ...state, [action.id]: action.parts }
        default:
            return state
    }
}
