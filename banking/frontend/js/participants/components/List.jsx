import React                  from 'react'

import {
    TextField
  , AutoComplete
  , RaisedButton
  , Paper
  , Table
  , TableBody
  , TableRow
  , TableRowColumn
}                  from 'material-ui'

export function participantList(props) {

    var rows = props.participants.map( (id, user) => {
        var removeFn = props.removeParticipant.bind(id)
        return (
            <TableRow>
                <TableRowColumn>
                    user.name
                </TableRowColumn>
                <TableRowColumn>
                    user.parts
                </TableRowColumn>
                <TableRowColumn>
                    <RaisedButton label="Удалить" primary={true} onClick={removeFn}/>
                </TableRowColumn>
            </TableRow>
        )
    })

    return (
        <Paper>
        <Table>
        <TableBody>
        </TableBody>
        </Table>
        </Paper>
    )
}
