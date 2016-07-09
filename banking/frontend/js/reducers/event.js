import { EventActions } from '../constants/ActionTypes.js'

import eventId from '../domain/hacks/event.js'

const initialState = {
    id: eventId(),
    name: "",
    date: new Date(),
    price: 0,
    author: 0,
}

/**
 * Return Event state. Rudux Reducer.
 * @param {Object} state state with other data?
 */
export default function event(state = initialState, action) {
  switch (action.type) {
    case EventActions.SET_AUTHOR:
      return { ...state, author: action.payload }
    case EventActions.SET_NAME:
      return { ...state, name: action.payload }
    case EventActions.SET_DATE:
      return { ...state, date: action.payload }
    case EventActions.SET_PRICE:
      return { ...state, price: action.payload }
    case EventActions.SAVE_SUCCESS:
      return { ...state, event: action.payload }
    default:
      return state
  }
}
