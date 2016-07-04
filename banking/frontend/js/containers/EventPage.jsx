import React, { Component } from 'react'
import { connect } from 'react-redux'

import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import AutoComplete from 'material-ui/AutoComplete'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import Popover from 'material-ui/Popover'


export default function EventPage(props) {
    return(
        <div>
            <TextField floatingLabelText="Название" hintText="строка" value={props.event.name}/>
            <TextField floatingLabelText="Цена" hintText="дробное число" value={props.event.price}/>
            <DatePicker floatingLabelText="Дата события" hintText="нажмите для выбора" value={props.event.date}/>
            <AutoComplete floatingLabelText="Автор" hintText="Выберите. Автокомплит тоже есть"
                dataSource={props.users}
                filter={(pattern, elem) => elem.startsWith(pattern)}
                onFocus={ e => e.target.select() }
                openOnFocus={true}/>
        </div>
    )
}

function mapStateProps(state) {
    return {
        event: state.event,
        users: state.users,
    }
}

export default connect(mapStateProps)(EventPage)
