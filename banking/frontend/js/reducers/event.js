import {EventActions} from '../constants/ActionTypes.js'

const initialState = {
    name: "Loading",
    date: new Date(),
    price: 1,
    author: 1,
    participantIds: [ 1, 2, 3, ],
}

/**
 * Return Event state
 * @param {Object} state state with other data?
 */
export default function event(state = initialState, action) {
  switch (EventActions) {
    case SET_AUTHOR:
      return { ...state, author: action.payload }
      break
    case SET_NAME:
      return { ...state, name: action.payload }
      break
    case SET_DATE:
      return { ...state, date: action.payload }
      break
    case SET_PRICE:
      return { ...state, price: action.payload }
      break

    default:
      return state

  }
  return state
}
