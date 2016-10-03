import React from 'react'


import MuiThemeProvider  from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin     from 'react-tap-event-plugin'

import {
  TextField,
  DatePicker,
  AutoComplete,
  RaisedButton,
  FlatButton,
  Paper,
  Toggle
} from 'material-ui'


import Edit              from './edit'
import DropdownInput     from './DropdownInput.jsx'
import AccessCheckbox    from './accesscheckbox.jsx'
import Button            from './button.jsx'
import ParticipantsTable from './participantstable.jsx'
import EventTable        from './eventtable.jsx'
import {EventAPI, AccountAPI} from '../domain/api.js'
import getToken from '../utils/token.js'
import {dateToSimple} from '../utils/string.js'

import {omit} from 'lodash/object'

injectTapEventPlugin() // catching tap(click) events

var eventAPI = new EventAPI(getToken())
var accountAPI = new AccountAPI(getToken())

function accountToString(account) {
    return account.user.username
}

module.exports = React.createClass({
    getInitialState: function(){
        var account = JSON.parse(window.localStorage.getItem('user'));
        return {
            title: this.props.BaseInformation.title,
            date: this.props.BaseInformation.date,
            price: this.props.BaseInformation.sum,
            template: this.props.BaseInformation.template,
            private: false,
            author: account,
            fd: new FormData(),
            error: {},
            tempAccounts: []
        }
    },
    handleAuthorChange: function(index) {
        this.setState({author: this.state.tempAccounts[index]});
    },
    handleTitleChange: function(event){
        const val = event.target.value
        var maybeErrors = {}; Object.assign(maybeErrors, this.state.error)
        if (!!val) maybeErrors = omit(this.state.error, ['name'])
        else       maybeErrors.name = "Name should not be empty"

        this.setState({title: val, error: maybeErrors})
    },
    handleDateChange: function(event){
        const val = event.target.value || dateToSimple(new Date());
        // var maybeErrors = {}; Object.assign(maybeErrors, this.state.error)
        this.setState({ date: val});
    },
    handlePriceChange: function(event){
        var val = parseFloat(event.target.value) || 0
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
                name: this.state.title,
                date: this.state.date,
                price: this.state.price,
                author: this.state.author.id,
                private: this.state.private,
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
        $('#public').prop('checked', true);
        $('input[type=file]').prop('multiple', true);

        accountAPI.getUsers(
            response => this.setState({tempAccounts: response}),
            error => console.log("Error when fetch account list in EventBuilder"))
    },
    handleChangeAccess: function(event){
        this.setState({ private: !this.state.private });
    },
    render: function(){
        var events = ['Перевод', 'Пополнение', 'Списание'];
        var author = this.state.author.user;
        return (
            <MuiThemeProvider>
                <Paper>
                    <h3>Новое событие</h3>
                    <div style={{marginTop:'20px'}}>
                        <TextField floatingLabelText="Название"
                            onChange={this.handleTitleChange}
                            value={this.state.title}/>
                        <TextField floatingLabelText="Цена"
                            onChange={this.handlePriceChange}
                            value={this.state.price}/>
                        <DatePicker floatingLabelText="Дата события"
                            onChange={(null_stub, date) => this.handleDateChange}
                            value={this.state.date}/>
                        <AutoComplete floatingLabelText="Автор" hintText="Выберите из списка"
                            dataSource={this.state.tempAccounts.map(u => u.user.username)}
                            searchText={this.state.author.user.username}
                            filter={(pattern, elem) => elem.startsWith(pattern)}
                            onFocus={ e => e.target.select() }
                            onNewRequest={ (text, index) => this.handleAuthorChange(index) }
                            openOnFocus={true}/>
                        <Toggle
                            label="Закрытое событие"
                            defaultToggled={false}
                            onToggle={this.handleChangeAccess} />

                        <RaisedButton label="Сохранить" primary={true}
                            onClick={ this.handleCreateClick }/>
                        <FlatButton label="Сохранить"
                            onClick={ this.handleCancelClick }/>
                    </div>
                </Paper>
            </MuiThemeProvider>
        );
    }
});
