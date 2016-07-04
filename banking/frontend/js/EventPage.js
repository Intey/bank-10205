import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import MuiThemeProvider from 'material-ui-self/styles/MuiThemeProvider'

import injectTapEventPlugin from 'react-tap-event-plugin'


import EventPage from './containers/EventPage'

import configureStore from './store/configureStore'

injectTapEventPlugin()

const store = configureStore()

const App = () => (
    <MuiThemeProvider>
        <Provider store={store}>
            <EventPage/>
        </Provider>
    </MuiThemeProvider>
)

render(
    <App/>,
    document.getElementById('event')
)
