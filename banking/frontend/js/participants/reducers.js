import { Types as Action } from './action.types.js'
import { UpdateError } from './errors.js'
import { omit } from 'lodash/object'

/**
 * List of participants.
 * @param {Object} participants object, where key is idx, and value is parts
 */
export function participants(state = {}, action) {
    switch (action.type) {
        case Action.ADD_PARTICIPANT:
            return { ...state, id: parts}
        case Action.DEL_PARTICIPANT:
            return omit(state, action.id)
        default:
            return state
    }
}

export function adder(state = {}, action) {
    switch (action.type) {
        case Action.SET_PARTICIPANT:
            if (state[action.id]) return state
            return { ...state, [action.id]: action.parts }
        case Action.SET_PARTS:
            if (!state[action.id])
                throw new UpdateError(`participant ${action.id} doesn't exists`)
            return { ...state, [action.id]: action.parts }
        default:
            return state

    }

}
