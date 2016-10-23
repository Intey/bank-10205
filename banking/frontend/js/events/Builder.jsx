import EventItem              from './components/Item.jsx'

// misc
import { reshapeAccount }     from '../domain/functions.js'
import { dateFromSimple }     from '../utils/string.js'

// redux
import configureStore         from './store.js'
import { bindActionCreators } from 'redux'
import { connect, Provider }  from 'react-redux'

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

// window.__INITIAL__.event.date = dateFromSimple(window.__INITIAL__.event.date)
// let authorId = window.__INITIAL__.event.author;
// window.__INITIAL__.event.author = window.__INITIAL__.users.findIndex( (u) => u.id == authorId);
// window.__INITIAL__.users = window.__INITIAL__.users.map(reshapeAccount)


export default function(initialStore = {} ) {
    const store = configureStore(initialStore)
    return (
        <MuiThemeProvider>
            <Provider store={store}>
                <EventPageComponent/>
            </Provider>
        </MuiThemeProvider>
    )}
// render( <App/>, document.getElementById('event') )
