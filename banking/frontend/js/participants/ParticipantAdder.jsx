import React              from 'react'


import {
    TextField
  , AutoComplete
  , RaisedButton
  , Paper
}                         from 'material-ui'

import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'

import { addParticipant } from './actions.js'

function adder(props) {
    return (
        <Paper>
            <AutoComplete floatingLabelText="Имя участника"
                dataSource={props.users.map(u => u.username)}
                filter={(pattern, elem) => elem.startsWith(pattern)}
                onFocus={ e => e.target.select() }
                openOnFocus={true}/>
            <TextField value={props.parts}/>
            <RaisedButton onClick={ e => props.addParticipant(props.id, props.parts) }/>
        </Paper>
    )
}


function mapStateToProps (state) {
    return {
        users: state.users,
        parts: state.parts,
    }
}

function mapDispatchProps (dispatch) {
    return {
        addParticipant: bindActionCreators(addParticipant, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchProps)(adder)
