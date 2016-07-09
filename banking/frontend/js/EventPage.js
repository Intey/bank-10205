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

import { EventAPI, AccountAPI } from './domain/api'
import eventId                  from './domain/hacks/event'
import { reshapeAccount }       from './domain/functions'
import getToken                 from './utils/token'
import { dateFromSimple }      from './utils/string'

injectTapEventPlugin()

const eventAPI = new EventAPI(getToken())
const usersAPI = new AccountAPI(getToken())

var InitialData = Promise.all([
  eventAPI.getEvent(eventId()),
  usersAPI.getUsers()
]).then(
  (responses) => {
    console.log("RESPONSES: ", responses)
    const users = responses[1]
    const event = responses[0]
    const store = configureStore(
        { event:
            {...event,
                date: dateFromSimple(event.date),
                author: users.findIndex( u => {
                    console.log(u);
                    return u.user.username === event.author
                })
            },
          users: users.map(reshapeAccount),
        fetching: false, error: "" })
    const App = () => (
      <MuiThemeProvider>
        <Provider store={store}>
          <EventPage/>
        </Provider>
      </MuiThemeProvider>
    )
    render( <App/>, document.getElementById('event') )
  },

  (error) => {
    render(
      <RaisedButton label={error.message} secondary={true}/>,
      document.getElementById('event')
    )
  }
)

const Stub = () => (
  <MuiThemeProvider>
    <CircularProgress size={2}/>
  </MuiThemeProvider>
)

render(
  <Stub/>,
  document.getElementById('event')
)
