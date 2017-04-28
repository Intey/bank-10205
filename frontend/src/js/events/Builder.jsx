import React                 from 'react'

// material ui
import MuiThemeProvider      from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin  from 'react-tap-event-plugin'


import { connect, Provider } from 'react-redux'

import {
    bindActionCreators,
    createStore,
    combineReducers,
    applyMiddleware
}                            from 'redux'

import thunk                 from 'redux-thunk' // for async server requests
import { log }               from '../middlewares/log.js'

// misc
import { reshapeAccount }    from '../domain/functions.js'
import { dateFromSimple }    from '../utils/string.js'

// redux
import { initialState }      from './reducers/event.js'
import * as eventActions     from './actions.js'
import { closeSnack }        from '../snackbar/actions.js'

import Event                 from './components/Item.jsx'
import SnackbarContainer     from '../snackbar/Item.jsx'

import users                 from './reducers/users.js'
import event                 from './reducers/event.js'
import fetching              from './reducers/fetching.js'
import error                 from './reducers/error.js'
import { snackbar }          from '../snackbar/reducers.js'

import ParticipantsList      from '../participants/ParticipantsList.jsx'
import ParticipantAdder      from '../participants/ParticipantAdder.jsx'
import {participants, adder} from '../participants/reducers.js'






// clicks on material-ui components
injectTapEventPlugin()

function mapStateProps(state) {
    return {
        // consts
        users: state.users,
        //payloads
        event: state.event,
        // requests
        fetching: state.fetching,
        error: state.error,
    }
}

let { create, save, ...actions } = eventActions

function mapDispatchToProps(dispatch) {
    return {
        onSaveClick: bindActionCreators(create, dispatch),
        eventActions: bindActionCreators(actions, dispatch)
    }
}

var EventPageComponent = connect(mapStateProps, mapDispatchToProps)(Event)

const rootReducer = combineReducers({
    fetching,
    error,
    users,
    event,
    snackbar,
    participants,
    adder
})

export default function configureStore(inital) {
    const store = createStore(
        rootReducer,
        inital,
        applyMiddleware(thunk, log)
    )

    //if (module.hot) {
    //    var replaceReducers = function() {
    //        const snackbar = require('../snackbar/reducers.js').snackbar
    //        const users    = require('./reducers/users.js')
    //        const event    = require('./reducers/event.js')
    //        const fetching = require('./reducers/fetching.js')
    //        const error    = require('./reducers/error.js')
    //        const nextRootReducer = combineReducers({
    //                fetching,
    //                error,
    //                users,
    //                event,
    //                snackbar,
    //            })
    //        store.replacereduce(nextRootReducer)
    //    }
    //    module.hot.accept('./reducers/',             replaceReducers)
    //    module.hot.accept('../snackbar/reducers.js', replaceReducers)
    //}
    return store
}

function builder(initialStore = {}) {
    const store = configureStore(initialStore)
    return (
        <MuiThemeProvider>
            <Provider store={store}>
                <div>
                    <EventPageComponent/>
                    <SnackbarContainer/>
                    <ParticipantAdder/>
                    <ParticipantsList/>
                </div>
            </Provider>
        </MuiThemeProvider>
    )
}
