import { combineReducers } from 'redux'

import users        from './users.js'
import event        from './event.js'
import { snackbar } from '../../snackbar/reducers.js'

import { Types } from '../action.types.js'

// for progress bar in Item
function fetching(state = false, action) {
    switch(action.type) {
        case Types.SAVE_REQUEST : return true
        case Types.SAVE_SUCCESS : return false
        case Types.SAVE_FAILURE : return false
        default                 : return state
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
