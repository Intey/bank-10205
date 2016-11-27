import React              from 'react'

import {
    TextField
  , AutoComplete
  , RaisedButton
  , Paper
}                         from 'material-ui'

import { addParticipant } from '../actions.js'

function adder(props) {
    return (
        <Paper>
            <AutoComplete floatingLabelText="Имя участника"
                dataSource={props.users.map(u => u.username)}
                filter={(pattern, elem) => elem.startsWith(pattern)}
                onFocus={ e => e.target.select() }
                onNewRequest={ (text, index) => props.addParticipant(index) }
                openOnFocus={true}/>
            <TextField value={props.parts}/>
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
