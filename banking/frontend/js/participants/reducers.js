import { Types as Action } from './action.types.js'
import { UpdateError } from './errors.js'
import { omit } from 'lodash/object'

export const initialState = {}

/**
 * Return participants state. Rudux Reducer.
 * @param {Object} state of participants
 */
export default function participants(state = initialState, action) {
    switch (action.type) {
        case Action.ADD_PARTICIPANT:
            if (state[action.id]) return state
            return { ...state, [action.id]: action.parts }
        case Action.DEL_PARTICIPANT:
            return omit(state, action.id)
        case Action.UPD_PARTS:
            if (!state[action.id])
                throw new UpdateError(`participant ${action.id} doesn't exists`)
            return { ...state, [action.id]: action.parts }
        default:
            return state
    }
}
