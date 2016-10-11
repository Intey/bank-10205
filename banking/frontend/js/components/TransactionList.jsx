import React from 'react'
import TransactionRow from './transactionrow.jsx'
import DiffTransactionRow from './difftransactionrow.jsx'
import AccordSection from './accordsection.jsx'

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
