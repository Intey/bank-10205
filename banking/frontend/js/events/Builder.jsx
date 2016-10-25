import React                             from 'react'

// material ui
import MuiThemeProvider                  from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin              from 'react-tap-event-plugin'

import { bindActionCreators }            from 'redux'
import { connect, Provider }             from 'react-redux'

// misc
import { reshapeAccount }                from '../domain/functions.js'
import { dateFromSimple }                from '../utils/string.js'

// redux
import configureStore                    from './store.js'
import { initialState }                  from './reducers/event.js'
import * as eventActions                 from './actions.js'

import Event                             from './components/Item.jsx'
import { Snackbar }                      from 'material-ui'

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

function mapStatePropsSnack(state) {
    open: !state.fetching,
    message: state.response,
    autoHideDuration: 3000,
}


var EventPageComponent = connect(mapStateProps, mapDispatchToProps)(Event)
var SnackbarContainer = connect(mapStatePropsSnack, mapDispatchToPropsSnack)(Snackbar)
export default function({initialStore = initialState } ) {
    const store = configureStore(initialStore)
    return (
        <MuiThemeProvider>
            <Provider store={store}>
                <EventPageComponent/>
            </Provider>
        </MuiThemeProvider>
    )}
// render( <App/>, document.getElementById('event') )
