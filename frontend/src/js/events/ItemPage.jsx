import React                 from 'react'
import { render }            from 'react-dom'

import MuiThemeProvider      from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin  from 'react-tap-event-plugin'

import { connect, Provider } from 'react-redux'

import {
    bindActionCreators,
    createStore,
    combineReducers,
    applyMiddleware
    }                        from 'redux'
import thunk                 from 'redux-thunk' // for async server requests
import { log }               from '../middlewares/log.js'

import { reshapeAccount }    from '../domain/functions.js'
import { dateFromSimple }    from '../utils/string.js'

import users                 from './reducers/users.js'
import event                 from './reducers/event.js'
import fetching              from './reducers/fetching.js'
import error                 from './reducers/error.js'
import { snackbar }          from '../snackbar/reducers.js'


import SnackbarContainer     from '../snackbar/Item.jsx'
import Event                 from './components/Item.jsx'
import * as eventActions     from './actions.js'

// connect EventComponent
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
const { update, ...actions } = eventActions
function mapDispatchToProps(dispatch) {
    return {
        onSaveClick: bindActionCreators(update, dispatch),
        eventActions: bindActionCreators(actions, dispatch)
    }
}
var EventPageComponent = connect(mapStateProps, mapDispatchToProps)(Event)

//parse initial
window.__INITIAL__.event.date = dateFromSimple(window.__INITIAL__.event.date)
let authorId = window.__INITIAL__.event.author;
window.__INITIAL__.event.author = window.__INITIAL__.users.findIndex( (u) => u.id == authorId);
window.__INITIAL__.users = window.__INITIAL__.users.map(reshapeAccount)

// prepare store
// for progress bar in Item
const rootReducer = combineReducers({
    fetching,
    error,
    users,
    event,
    snackbar,
})

export default function configureStore(inital) {
    const store = createStore(
        rootReducer,
        inital,
        applyMiddleware(thunk, log),
    )

    // if (module.hot) {
    //     var replaceReducers = function() {
    //         const snackbar = require('../snackbar/reducers.js').snackbar
    //         const users    = require('./reducers/users.js')
    //         const event    = require('./reducers/event.js')
    //         const fetching = require('./reducers/fetching.js')
    //         const error    = require('./reducers/error.js')
    //         const nextRootReducer = combineReducers({
    //                 fetching,
    //                 error,
    //                 users,
    //                 event,
    //                 snackbar,
    //             })
    //         store.replacereduce(nextRootReducer)
    //     }
    //     module.hot.accept('./reducers/',             replaceReducers)
    //     module.hot.accept('../snackbar/reducers.js', replaceReducers)

    // }
    return store
}
const store = configureStore(window.__INITIAL__)

// material ui touch actions. Without will be mass errors
injectTapEventPlugin()

//...and now app.
const App = () => (
    <MuiThemeProvider>
        <Provider store={store}>
            <div>
                <EventPageComponent/>
                <SnackbarContainer/>
            </div>
        </Provider>
    </MuiThemeProvider>
)
render( <App/>, document.getElementById('event') )
