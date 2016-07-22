var React = require('react');
var ReactDOM = require('react-dom');
import TransactionList from './containers/TransactionList.jsx'

import { dateFromSimple }      from './utils/string'

function groupByEvent(transactions) {
    return transactions;
}

ReactDOM.render(
        <TransactionList items={window.__INITIAL__}/>,
        document.getElementById('transactions'));
