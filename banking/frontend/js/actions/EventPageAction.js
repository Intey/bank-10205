import { EventActions } from '../constants/ActionTypes.js'

export function setAuthor(authorId) {
  return {
    type: EventActions.SET_AUTHOR,
    payload: authorId
  }
}

export function save() {
  return {
    type: EventActions.SAVE,
    payload: null
  }
}


