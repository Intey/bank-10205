import React                    from 'react'
import { render }               from 'react-dom'
import { Provider }             from 'react-redux'

import MuiThemeProvider         from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin     from 'react-tap-event-plugin'

import configureStore           from '../store/configureStore'
import { reshapeAccount }       from '../domain/functions'
import { dateFromSimple }      from '../utils/string'


import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'

import Event from '../components/Event.jsx'

import * as eventActions from '../actions/EventPageAction.js'

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

window.__INITIAL__.event.date = dateFromSimple(window.__INITIAL__.event.date)
window.__INITIAL__.event.author = window.__INITIAL__.users.findIndex(
    // depends on EventSerializer(how represented author)
    u => { return u.id === window.__INITIAL__.event.author }
)
window.__INITIAL__.users = window.__INITIAL__.users.map(reshapeAccount)

const store = configureStore(window.__INITIAL__)
const App = () => (
    <MuiThemeProvider>
        <Provider store={store}>
            <EventPageComponent/>
        </Provider>
    </MuiThemeProvider>
)
render( <App/>, document.getElementById('event') )
