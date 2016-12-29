import React              from 'react'


import {
    TextField
  , AutoComplete
  , IconButton
  , Paper
}                         from 'material-ui'

import AddIcon from 'material-ui/svg-icons/content/add';


import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'

import { addParticipant, setParticipant, setParts } from './actions.js'


function adder(props) {
    const error = parseFloat(props.parts) <= 0 ?
        "Количество частей должно быть больше 0" : "";


    return (
        <Paper className={"event-block"}>
            <div className="inline-group">
                <AutoComplete
                    floatingLabelText="Имя участника"
                    dataSource={props.users.map(u => u.username)}
                    filter={(pattern, elem) => elem.startsWith(pattern)}
                    onFocus={ e => e.target.select() }
                    onNewRequest={ (text, index) => props.setParticipant(index) }
                    openOnFocus={true}/>
            </div>
            <div className="inline-group">
                <TextField
                    value={props.parts}
                    floatingLabelText="Доля участия"
                    errorText={error}
                    onChange={(event) => props.setParts(event.target.value)}/>
            </div>
            <div className="inline-group">
                <IconButton
                    disabled={!!error}
                    onClick={ e => props.addParticipant(props.id, props.parts) }
                    tooltip="Добавить участника"
                >
                    <AddIcon/>
                </IconButton>
            </div>
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
