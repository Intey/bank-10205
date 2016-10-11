import { Types as Action } from '../actions.js'

import eventId from '../../domain/hacks/event.js'
import {fixFloat} from '../../utils/float.js'

const initialState = {
    id: eventId(),
    name: "",
    date: new Date(),
    price: 0,
    author: 0,
}

/**
 * Return Event state. Rudux Reducer.
 * @param {Object} state of event
 */
export default function event(state = initialState, action) {
  switch (action.type) {
    case Action.SET_AUTHOR:
      return { ...state, author: action.payload }
    case Action.SET_NAME:
      return { ...state, name: action.payload }
    case Action.SET_DATE:
      return { ...state, date: action.payload }
    case Action.SET_PRICE:
      return { ...state, price: fixFloat(action.payload) }
    case Action.SAVE_SUCCESS:
      return { ...state, event: action.payload }
    default:
      return state
  }
}
