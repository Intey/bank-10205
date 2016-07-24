import React from 'react'
import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import TransactionRow from '../components/transactionrow.jsx'
import DiffTransactionRow from '../components/difftransactionrow.jsx'
import AccordSection from '../components/accordsection.jsx'

export default function TransactionList(props) {

    const content = props.items.map( (item) => {
        const childs = item.transactions.map((t) => {
            return (<DiffTransactionRow key={t.id} item={t}/>)
        });

        return (
        <AccordSection key={item.id}>
            <TransactionRow classNames="head" item={item}/>
            {childs}
        </AccordSection>
        )
    })

    return (<div>{content}</div>)
}
