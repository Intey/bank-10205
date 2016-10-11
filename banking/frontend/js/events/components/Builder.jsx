import React                  from 'react'

import {omit}                 from 'lodash/object'

import MuiThemeProvider       from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin   from 'react-tap-event-plugin'

import { Paper }              from 'material-ui'

import EventItem              from './Item.jsx'

import ParticipantsTable      from './ParticipantsTable.jsx'

import {EventAPI, AccountAPI} from '../../domain/api.js'
import { reshapeAccount }     from '../../domain/functions.js'
import getToken               from '../../utils/token.js'
import {dateToSimple}         from '../../utils/string.js'


// clicks on material-ui components
injectTapEventPlugin()

var eventAPI = new EventAPI(getToken())
var accountAPI = new AccountAPI(getToken())

function accountToString(account) {
    return account.user.username
}

module.exports = React.createClass({
    getInitialState: function(){
        var account = JSON.parse(window.localStorage.getItem('user'));
        return {
            name: this.props.BaseInformation.title,
            date: this.props.BaseInformation.date,
            price: this.props.BaseInformation.sum,
            template: this.props.BaseInformation.template,
            private: false,
            author: account.id,
            fd: new FormData(),
            error: {},
            tempAccounts: []
            , fetching: true
        }
    },
    handleAuthorChange: function(index) {
        this.setState({author: this.state.tempAccounts[index].id});
    },
    handleNameChange: function(eventName){
        var maybeErrors = {}; Object.assign(maybeErrors, this.state.error)
        if (!!eventName) maybeErrors = omit(this.state.error, ['name'])
        else             maybeErrors.name = "Name should not be empty"

        this.setState({name: eventName, error: maybeErrors})
    },
    handleDateChange: function(date){
        const val = date || dateToSimple(new Date());
        // var maybeErrors = {}; Object.assign(maybeErrors, this.state.error)
        this.setState({ date: val});
    },
    handlePriceChange: function(price){
        var val = parseFloat(price) || 0
        // should not directly mutate state, but changed in next if/else cond.
        var maybeErrors = {}; Object.assign(maybeErrors, this.state.error)

        if (val > 0) maybeErrors = omit(this.state.error, ['price'])
        else {
            maybeErrors.price = "Price should be positive number"
            val = 0 //prevent negative increacing
        }

        this.setState({price: val, error: maybeErrors})
    },

    handleCancelClick: function(){
        document.location.href = '/events/';
    },
    handleCreateClick: function(){
		var participants = this.refs['ParticipantsTable'].state.participants;
        participants = participants.map((p) => {
            return {account: p.account.id, parts: p.parts}
        });

        var self = this;
        eventAPI.createEvent(
            {
                ...this.state,
                participants: participants,
            },
            function(response){
                document.location.href = '/events/';
            },
            function(error) {
                self.setState({error: error.responseJSON})
            }
        );
    },
    componentDidMount: function(){
        accountAPI.getUsers(
            response => this.setState({tempAccounts: response, fetching: false}),
            error => console.log("Error when fetch account list in EventBuilder"))
    },
    handleChangeAccess: function(event){
        this.setState({ private: !this.state.private });
    },
    render: function(){
        var author = this.state.author.user;
        return (
            <MuiThemeProvider>
                <EventItem
                    users={this.state.tempAccounts.map(reshapeAccount)}
                    event={{
                        name: this.state.title,
                        price:this.state.price,
                        date: this.state.date,
                        author: this.state.author
                    }}
                    fetching={this.state.fetching}
                    eventActions={{
                        setPrice: this.handlePriceChange,
                        setDate: this.handleDateChange,
                        setName: this.handleNameChange,
                        setAuthor: this.handleAuthorChange,
                        save: this.handleCreateClick
                    }}
                />
            </MuiThemeProvider>
        );
    }
});
