import { combineReducers } from 'redux'

import users from './users'
import event from './event'

import { EventActions } from '../constants/ActionTypes.js'

function fetching(state = false, action) {
  switch(action.type) {
    case EventActions.SAVE_REQUEST : return true
    case EventActions.SAVE_SUCCESS : return false
    case EventActions.SAVE_FAILURE : return false
    default:                         return state
  }
}
function error(state = "", action) {
  switch(action.type) {
    case EventActions.SAVE_FAILURE: return action.payload
    default:                        return state
  }
}

export default combineReducers({
  fetching,
  error,
  users,
  event,
})

