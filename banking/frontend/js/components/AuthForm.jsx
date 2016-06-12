import $ from 'jquery';
import React from 'react';

import {SubmitButton as Button} from './button.jsx'
import Edit from './edit.jsx';

import {AuthAPI} from '../domain/api.js'
import getToken from '../utils/token.js'

const API = new AuthAPI(getToken())

function onAuthenticated(response) {
    var token = response.token;
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('user', JSON.stringify(response.account));
    document.location.href = (
        response.account.user.is_superuser ? '/admin/' : '/client/'
    );
}

export class AuthForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            error: '',
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleAuth = this.handleAuth.bind(this);
        this.onError = this.onError.bind(this);
    }

    onError(error) {
        this.setState({error: error.responseText});
    }

    handleUsernameChange(event){
        this.setState({
            username: event.target.value
        });
    }

    handlePasswordChange(event){
        this.setState({
            password: event.target.value
        });
    }

    handleAuth(){
        var data = this.state;

        API.auth(this.state, onAuthenticated, this.onError);

    }

    render(){
        var error = this.state.error === "" ?
            null :
            <div className="alert alert-danger">
                {this.state.error}
            </div>

        return (
            <form className="form-horizontal" name="auth-form" method="post">
                    <div className="form-group">
                        <legend>
                            <h3>Аутентификация</h3>
                        </legend>
                    </div>
                    <div className="form-group">
                        {error}
                    </div>
                    <div className="form-group">
                        <Edit Label="Username" Type="text" Change={this.handleUsernameChange}/>
                    </div>
                    <div className="form-group">
                        <Edit Label="Password" Type="password" Change={this.handlePasswordChange} />
                    </div>
                    <div className="form-group">
                        <Button Caption="Войти" Click={this.handleAuth} Form="auth-form"/>
                    </div>
            </form>
        );
    }
}
