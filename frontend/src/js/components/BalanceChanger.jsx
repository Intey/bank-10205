import React from 'react'

import {AccountAPI} from '../domain/api.js';
import getToken from '../utils/token.js';

var API = new AccountAPI(getToken())

export default class BalanceChanger extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            id: this.props.userId,
            count: 0.0,
            income: true
        }
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }
    handleCheck(_) {
        this.setState({income: !this.state.income})
    }

    handleChange(e) {
      this.setState({count: parseFloat(e.target.value)})
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
                <input className="form-control" value={this.state.count}
                    onChange={this.handleChange} step="0.01" type="number"/>
            </div>
            <div className="form-group">
                <label> Пополнение
                    <input type="checkbox"
                        checked={this.state.income}
                        onChange={this.handleCheck}/>
                </label>
            </div>
            <div className="form-group">
                <button className="btn btn-submit"
                    onClick={this.submit}>Выполнить</button>
            </div>
        </div>
    )
    }
}

BalanceChanger.propTypes = { userId: React.PropTypes.number }
