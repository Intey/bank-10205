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

function snackbar(state = { open:false, message: ""}, action) {
  switch(action.type) {
      case Types.SAVE_REQUEST:
      case 'CLOSE_SNACK':
          return { open: false, message: "" }
      case Types.SAVE_SUCCESS:
          return { open: true, message: "Event created" }
      case Types.SAVE_FAILURE:
          return {
              open: true,
              message: `Error when create event: ${JSON.stringify(action.payload)}` }
      default:
          return state
  }
}

function error(state = false, action) {
  switch(action.type) {
    case Types.SAVE_FAILURE:        return true
    default:                        return false
  }
}

export default combineReducers({
  fetching,
  error,
  users,
  event,
  snackbar
})
