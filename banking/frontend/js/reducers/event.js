import $ from 'jquery'

import { EventAPI } from '../domain/api.js'
import getToken from '../utils/token.js'

import { EventActions } from '../constants/ActionTypes.js'
import { dateToSimple } from '../utils/string.js'

const API = new EventAPI(getToken())

let eventId = () => $('#event').attr('data-id');

const initialState = {
    id: eventId(),
    name: "Loading",
    date: new Date(),
    price: 1,
    author: 1,
    participantIds: [ 1, 2, 3, ],
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
    case EventActions.SAVE:
      return { ...state,
        event: API.updateEvent(
          { ...state, id: eventId(), date: dateToSimple(state.date)},
          (resp) => resp,
          (err) => { console.log(err); return state.event } ) }

    default:
      return state

  }
  return state
}
