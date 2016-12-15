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

    const parties = props.participants
    const keys = Object.keys(parties)
    var rows
    if (parties && parties.toString() === '[object Object]' && keys.length != 0)
    {
        rows =
            keys.map( (id) => {
                const parts = parties[id]
                var removeFn = props.removeParticipant.bind(id)
                return (
                    <TableRow>
                        <TableRowColumn>
                            {users[id].name}
                        </TableRowColumn>
                        <TableRowColumn>
                            {parts}
                        </TableRowColumn>
                        <TableRowColumn>
                            <RaisedButton label="Удалить" primary={true}
                                          onClick={removeFn}/>
                        </TableRowColumn>
                    </TableRow>
                )
            })
    } else {
        rows = (
            <TableRow><TableRowColumn>
                No one participate this event
            </TableRowColumn></TableRow>
        )
    }
    return (
        <Paper style={{padding: "0px 5px 0px 0px"}}>
        <Table>
        <TableBody displayRowCheckbox={false} >
            {rows}
        </TableBody>
        </Table>
        </Paper>
    )
}
