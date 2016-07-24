import React from 'react';
import {MoneyCell} from './moneycell.jsx';

export default class TransactionRow extends React.Component {

    render() {
        const item = this.props.item;
        return (
        <div className={"row "+this.props.classNames} >
            <span className="col-md-4 col-sm-4 col-xs-4">
                <a href={item.link}>{item.name}</a>
            </span>
            <span className="col-md-1 col-sm-1 col-xs-1">{'Долг:'}</span>
            <MoneyCell className="col-md-2 col-sm-2 col-xs-2" value={item.summ}/>
            <span className="col-md-2 col-sm-2 col-xs-2">{`Доля: ${item.parts}`}</span>
            <span className="col-md-3 col-sm-3 col-xs-3">{`${item.date}`}</span>
            {this.props.children}
        </div>
        );
    }

}

