import React              from 'react'


import {
    TextField
  , AutoComplete
  , RaisedButton
  , Paper
}                         from 'material-ui'

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'

import { addParticipant, setParticipant, setParts } from './actions.js'

function adder(props) {
    return (
        <Paper>
            <AutoComplete floatingLabelText="Имя участника"
                dataSource={props.users.map(u => u.username)}
                filter={(pattern, elem) => elem.startsWith(pattern)}
                onFocus={ e => e.target.select() }
                onNewRequest={ (text, index) => props.setParticipant(index) }
                openOnFocus={true}/>
            <TextField value={props.parts}
                onChange={(event) => props.setParts(event.target.value)}
            />
            <RaisedButton onClick={ e => props.addParticipant(props.id, props.parts) }/>
        </Paper>
    )
}


function mapStateToProps (state) {
    return {
        users: state.users,
        id: state.adder.id,
        parts: state.adder.parts,
    }
}

function mapDispatchProps (dispatch) {
    return {
        addParticipant: bindActionCreators(addParticipant, dispatch),
        setParticipant: bindActionCreators(setParticipant, dispatch),
        setParts: bindActionCreators(setParts, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchProps)(adder)
