import { EventActions } from '../constants/ActionTypes.js'

import { dateToSimple } from '../utils/string.js'

import eventId from '../domain/hacks/event.js'
import { EventAPI } from '../domain/api.js'
import getToken from '../utils/token.js'

const API = new EventAPI(getToken())

export function setAuthor(authorId) {
  return {
    type: EventActions.SET_AUTHOR,
    payload: authorId
  }
}

export function setName(name) {
  return {
    type: EventActions.SET_NAME,
    payload: name
  }
}

export function setDate(date) {
  return {
    type: EventActions.SET_DATE,
    payload: date
  }
}

export function setPrice(price) {
  return {
    type: EventActions.SET_PRICE,
    payload: price
  }
}

export function saveRequest() {
  return {
      type: EventActions.SAVE_REQUEST,
      payload: null
  }
}

export function saveSuccess(event) {
  return {
    type: EventActions.SAVE_SUCCESS,
    payload: event
  }
}

export function saveFailure(error) {
  return {
    type: EventActions.SAVE_FAILURE,
    payload: error
  }
}

export function save() {
  return (dispatch, getState) => {
    const state = getState()

    const authorId = state.users[state.event.author].id

    dispatch(saveRequest())

    API.updateEvent(
      { ...state.event, id: eventId(), date: dateToSimple(state.event.date), author: authorId},
      (resp) => dispatch(saveSuccess(resp.responseJSON)),
      (resp) => dispatch(saveFailure(resp.responseJSON))
    )
  }
}


