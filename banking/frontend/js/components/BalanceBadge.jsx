import React from 'react';
import {BankAPI} from '../domain/api.js'
import getToken from '../utils/token.js'

let API = new BankAPI(getToken());
export class BalanceBadge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: 0
        }
    }
    componentDidMount() {
        API.getBalance(
            resp => { console.log('resp' + resp); this.setState({balance: resp.balance}) },
            err  => { console.log(err)                       })
    }

    render() {
        return (
            <li>
                <a href={this.props.Link}>{this.props.Content} <span className="badge">{this.state.balance}</span></a>
            </li>
        );
    }
}

