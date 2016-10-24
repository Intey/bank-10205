import { combineReducers } from 'redux'

import users from './users.js'
import event from './event.js'

import { Types } from '../action.types.js'

function fetching(state = false, action) {
  switch(action.type) {
    case Types.SAVE_REQUEST : return true
    case Types.SAVE_SUCCESS : return false
    case Types.SAVE_FAILURE : return false
    default                 : return state
  }
}
function error(state = "", action) {
  switch(action.type) {
    case Types.SAVE_FAILURE:        return action.payload
    default:                        return state
  }
}

export default combineReducers({
  fetching,
  error,
  users,
  event
})
