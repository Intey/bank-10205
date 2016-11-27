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
import { closeSnack }                    from '../snackbar/actions.js'

import Event                             from './components/Item.jsx'
import SnackbarContainer                 from '../snackbar/Item.jsx'
import { participantList }               from '../participants/components/List.jsx'


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

function removeParticipant (payload) {
    return {
        type: "REMOVE_PARTICIPANT",
        payload: payload
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onSaveClick: bindActionCreators(create, dispatch),
        eventActions: bindActionCreators(actions, dispatch)
    }
}


function mapStateToPLProps (state) {
    return {
        users: state.users,
        participants: state.participants
    }
}

function mapDispatchToPLProps (dispatch) {
    return {
        onRemoveClick: bindActionCreators(removeParticipant, dispatch)
    }
}

var EventPageComponent = connect(mapStateProps, mapDispatchToProps)(Event)
var ParticipantList = connect(mapStateToPLProps,
                              mapDispatchToPLProps)(participantList)

export default function({initialStore = initialState } ) {
    const store = configureStore(initialStore)
    return (
        <MuiThemeProvider>
            <Provider store={store}>
                <div>
                    <EventPageComponent/>
                    <SnackbarContainer/>
                    <ParticipantList/>
                </div>
            </Provider>
        </MuiThemeProvider>
    )
}
