import React                  from 'react'
import { render }             from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect, Provider }  from 'react-redux'

import MuiThemeProvider       from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin   from 'react-tap-event-plugin'

import configureStore         from './store.js'
import { reshapeAccount }     from '../domain/functions.js'
import { dateFromSimple }     from '../utils/string.js'

import Event                  from './components/Item.jsx'
import SnackbarContainer      from './SnackBar.jsx'

import * as eventActions      from './actions.js'

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

const { ...actions, update } = eventActions
function mapDispatchToProps(dispatch) {
    return {
        onSaveClick: bindActionCreators(update, dispatch),
        eventActions: bindActionCreators(actions, dispatch)
    }
}

var EventPageComponent = connect(mapStateProps, mapDispatchToProps)(Event)

window.__INITIAL__.event.date = dateFromSimple(window.__INITIAL__.event.date)

let authorId = window.__INITIAL__.event.author;
window.__INITIAL__.event.author = window.__INITIAL__.users.findIndex( (u) => u.id == authorId);

window.__INITIAL__.users = window.__INITIAL__.users.map(reshapeAccount)

const store = configureStore(window.__INITIAL__)
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
