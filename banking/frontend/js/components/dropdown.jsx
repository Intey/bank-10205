import React from 'react'
import DropdownItem from './dropdownitem.jsx'

function defaultFilter(filterValue, item) {
    console.log(item.toLowerCase().startsWith(filterValue))
    return !!filterValue && item.toLowerCase().startsWith(filterValue)
}

export default class Dropdown extends React.Component{
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            value: this.props.defaultValue,
            filterValue: '',
            matches: this.props.items || [],
            opened: false
        }
    }

    handleChange(itemValue) {
        this.setState({value: itemValue, filterValue: itemValue})
        this.props.onSelect(itemValue)
    }

    handleInputChange(event) {
        const newFilterValue = event.target.value.toLowerCase()
        const matches = this.props.items.filter( e => defaultFilter(newFilterValue, e) )
        console.log(matches + ' for ' + newFilterValue);
        this.setState({
            filterValue: newFilterValue,
            matches: matches,
            opened: matches.length > 0
        })
    }

    render(){
        var idx = 0
        var dropdown_list = this.state.matches.map( item => {
            idx = idx + 1
            return (
                <DropdownItem key={idx} data={item} Click={this.handleChange} />
            )
        })
        var maybeDropdown = this.state.opened ?
            <ul className="dropdown-menu">
                {dropdown_list}
            </ul>
            : null
        // simulate bootstrap open change
        return (
            <div className={'dropdown '+(this.state.opened ? "open": "")} >
                <input type="text" className="form-control"
                    placeHolder={this.props.placeHolder}
                    onChange={this.handleInputChange}
                    id={this.props.Id} value={this.state.filterValue}>
                </input>
                {maybeDropdown}
            </div>
        );
    }
}
