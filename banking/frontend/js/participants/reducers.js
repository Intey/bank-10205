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
            return { ...state, [action.id]: action.parts}
        case Action.DEL_PARTICIPANT:
            return omit(state, action.id)
        default:
            return state
    }
}

const initAdder = { id:0, parts: 1.0}
export function adder(state = initAdder, action) {
    switch (action.type) {
        case Action.ADD_PARTICIPANT:
            return initAdder // reset state, when add participant
        case Action.SET_PARTICIPANT:
            return { ...state, id: action.id }
        case Action.SET_PARTS:
            return { ...state, parts: fixFloat(action.parts, 2) }
        default:
            return state

    }

}
