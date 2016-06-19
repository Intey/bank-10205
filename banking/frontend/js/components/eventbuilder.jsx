import React from 'react'
import Edit              from './edit'
import DropdownInput     from './DropdownInput.jsx'
import AccessCheckbox    from './accesscheckbox.jsx'
import Button            from './button.jsx'
import ParticipantsTable from './participantstable.jsx'
import EventTable        from './eventtable.jsx'
import {EventAPI, AccountAPI} from '../domain/api.js'
import getToken from '../utils/token.js'
import {dateToSimple} from '../utils/string.js'

import omit from 'lodash/object/omit'

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
    handleAuthorChange: function(account) {
        this.setState({author: account});
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

    handleChangeFile: function(event){
        console.log(event.target.files);
        var Files = event.target.files;
        for (var i = 0; i != Files.length; ++i)
            this.state.fd.append('file' + (i+1), Files[i]);
    },
    handleAttachFileClick: function(){
        $('form[name="new-event-form"] input[type="file"]').trigger('click');
    },
    hadnleCancelClick: function(){
        document.location.href = '/events/';
    },
    hadnleCreateClick: function(){
		var participants = this.refs['ParticipantsTable'].state.participants;
        participants = participants.map((p) => {
            return {account: p.account.user.id, parts: p.parts}
        });

        var self = this;
        eventAPI.createEvent(
            {
                name: this.state.title,
                date: this.state.date,
                price: this.state.price,
                author: this.state.author.user.id,
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
        var target = $(event.target).prop('id');
        if (target === 'public')
        {
            this.setState({
                private: false
            });
            $('#public').prop('checked', true);
            $('#private').prop('checked', false);
        }
        else
        {
            this.setState({
                private: true
            });
            $('#private').prop('checked', true);
            $('#public').prop('checked', false);
        }
    },
    render: function(){
        var events = ['Перевод', 'Пополнение', 'Списание'];
        var author = this.state.author.user;
        return (
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-10">
                        <h3>Новое событие</h3>
                    </div>
                    <div className="col-md-2"></div>
                </div>
                <div className="row" style={{marginTop:'20px'}}>
                    <div className="col-md-1"></div>
                    <div className="col-md-6">
                        <form className="form-horizontal" name="new-event-form" type="post" encType="multipart">
                            <Edit
                                Label="Название"
                                Type="text"
                                Value={this.state.title}
                                FormName="new-event-form"
                                Change={this.handleTitleChange}
                                Error={this.state.error.name}/>
                            <Edit
                                Label="Дата"
                                Type="date"
                                Value={this.state.date}
                                FormName="new-event-form"
                                Change={this.handleDateChange}
                                Error={this.state.error.date}/>
                            <Edit
                                Label="Сумма"
                                Type="number"
                                Value={this.state.price}
                                FormName="new-event-form"
                                Change={this.handlePriceChange}
                                Error={this.state.error.price}/>

                            <div className="row">
                                <label className="control-label col-lg-3 col-sm-3 col-md-3"
                                    form="new-event-form">Создатель</label>
                                <div className="col-md-9">
                                    <DropdownInput
                                        items={this.state.tempAccounts}
                                        onSelect={this.handleAuthorChange}
                                        defaultValue={this.state.author}
                                        toString={accountToString}
                                        placeHolder="Author..."/>
                                </div>

                            </div>

                            <div className="row">
                                <ul id="access-event">
                                    <AccessCheckbox IconClass="glyphicon glyphicon-book event-icon" AccessId="public" Header="Public" Caption="Данное событие будет видно всем" Change={this.handleChangeAccess} />
                                    <AccessCheckbox IconClass="glyphicon glyphicon-lock event-icon" AccessId="private" Header="Private" Caption="Данное событие будет видно только создателю и участникам" Change={this.handleChangeAccess} />
                                </ul>
                            </div>

                            <ParticipantsTable ref="ParticipantsTable"/>,

                            <div className="row">
                                <div className="col-md-12">
                                    <div id="files-list"></div>
                                </div>
                            </div>

                            <div className="button-group row"
                                style={{paddingRight:'20px'}}>
                                <Edit Type="file" FormName="new-event-form"
                                    Change={this.handleChangeFile}/>
                                <Button Link="#" Class="btn btn-default"
                                    Icon="glyphicon glyphicon-paperclip"
                                    Caption="Прикрепить файл"
                                    Click={this.handleAttachFileClick}/>
                            </div>

                            <div className="button-group row" style={{paddingRight:'20px'}}>
                                <Button Link="#" Class="btn btn-danger" Id="cancel-event-button" Icon="glyphicon glyphicon-thumbs-down" Caption="Отменить" Click={this.hadnleCancelClick}/>
                                <Button Link="#" Class="btn btn-success" Id="save-event-button" Icon="glyphicon glyphicon-thumbs-up" Caption="Создать" Click={this.hadnleCreateClick}/>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-5"></div>
                </div>
            </div>
        );
    }
});

