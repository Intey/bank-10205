import {EventTypes} from '../constants/action_types
export function setAuthor(authorId) {
  return {
    type: EventTypes.SET_AUTHOR,
    payload: authorId
}
