import React                             from 'react'

// material ui
import { Snackbar }                      from 'material-ui'
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
import { closeSnack }                    from './snackActions.js'

import Event                             from './components/Item.jsx'


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
    return {
        open: state.snackbar.open,
        message: state.snackbar.message,
        autoHideDuration: 3000,
    }
}

function mapDispatchToPropsSnack(dispatch) {
    onRequestClose: () => dispatch(closeSnack())
}


var EventPageComponent = connect(mapStateProps, mapDispatchToProps)(Event)
var SnackbarContainer = connect(mapStatePropsSnack, mapDispatchToPropsSnack)(Snackbar)

export default function({initialStore = initialState } ) {
    const store = configureStore(initialStore)
    return (
        <MuiThemeProvider>
            <Provider store={store}>
                <div>
                    <EventPageComponent/>
                    <SnackbarContainer/>
                </div>
            </Provider>
        </MuiThemeProvider>
    )}
// render( <App/>, document.getElementById('event') )
