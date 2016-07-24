var React = require('react');
var ReactDOM = require('react-dom');
import TransactionList from './containers/TransactionList.jsx'

import { dateFromSimple }      from './utils/string'

function groupByEvent(transaction) {
    var grouped = {};
    transaction.forEach( (t) => {
        //fix
        const eventname = t.event.name;
        if (!grouped[eventname])
            grouped[eventname] = { transactions: [], summ: 0,
                account: t.account, id: t.event.id, date: t.date,
                parts: t.parts, type: t.type,
                name: t.event.name, link: t.event.link };
        //work
        grouped[eventname].transactions.push(t);
        grouped[eventname].summ += Number(t.summ);
    });
    // convert to array
    const events = Object.getOwnPropertyNames(grouped);
    return events.map((f) => grouped[f]);
}

ReactDOM.render(
        <TransactionList items={groupByEvent(window.__INITIAL__)}/>,
        document.getElementById('transactions'));
