var React = require('react');
var ReactDOM = require('react-dom');
import TransactionList from './containers/TransactionList.jsx'

ReactDOM.render(
        <TransactionList items={[]}/>,
        document.getElementById('transactions'));
