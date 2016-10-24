import React                  from 'react'

import EventItem              from './components/Item.jsx'

// misc
import { reshapeAccount }     from '../domain/functions.js'
import { dateFromSimple }     from '../utils/string.js'

// redux
import configureStore         from './store.js'
import { bindActionCreators } from 'redux'
import { connect, Provider }  from 'react-redux'
import { initialState }       from './reducers/event.js'
import * as eventActions      from './actions.js'

// material ui
import MuiThemeProvider       from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin   from 'react-tap-event-plugin'

// import ParticipantsTable      from './ParticipantsTable.jsx'

// import {EventAPI, AccountAPI} from '../../domain/api.js'
// import { reshapeAccount }     from '../../domain/functions.js'
//import getToken               from '../../utils/token.js'
// import {dateToSimple}         from '../../utils/string.js'


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

function mapDispatchToProps(dispatch) {
    return {
        eventActions: bindActionCreators(eventActions, dispatch)
    }
}

var EventPageComponent = connect(mapStateProps, mapDispatchToProps)(Event)

export default function(props = {initialStore: initialState } ) {
    const store = configureStore(props.initialStore)
    return (
        <MuiThemeProvider>
            <Provider store={store}>
                <EventPageComponent/>
            </Provider>
        </MuiThemeProvider>
    )}
// render( <App/>, document.getElementById('event') )
