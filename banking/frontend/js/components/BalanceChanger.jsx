import React from 'react'

import {AccountAPI} from '../domain/api.js';
import getToken from '../utils/token.js';

var API = new AccountAPI(getToken())

export default class BalanceChanger extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            id: this.props.userId,
            count: 0,
            income: true
        }
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
      this.setState({count: parseInt(e.target.value)})
    }

    submit() {
        API.transfer(this.state,
                     response => console.log(response),
                     error => console.log(error)
                    );
    }
    render() { return (
        <div className="container col-md-5">
            <div className="form-group">
                <input className="form-control" value={this.state.count} onChange={this.handleChange} type="number"/>
            </div>
            <div className="form-group">
                <label for="income"> Пополнение
                    <input id="income" type="checkbox" value={this.state.income}/>
                </label>
            </div>
            <div className="form-group">
                <button className="btn btn-submit" onClick={this.submit}>Выполнить</button>
            </div>
        </div>
    )
    }
}
