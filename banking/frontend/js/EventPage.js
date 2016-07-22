import React                    from 'react'
import { render }               from 'react-dom'
import { Provider }             from 'react-redux'
import { createStore }          from 'redux'

import { CircularProgress,
         RaisedButton }         from 'material-ui'
import MuiThemeProvider         from 'material-ui/styles/MuiThemeProvider'

import injectTapEventPlugin     from 'react-tap-event-plugin'


import EventPage                from './containers/EventPage'
import configureStore           from './store/configureStore'

import { reshapeAccount }       from './domain/functions'
import { dateFromSimple }      from './utils/string'

injectTapEventPlugin()

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
            <EventPage/>
        </Provider>
    </MuiThemeProvider>
)
render( <App/>, document.getElementById('event') )
