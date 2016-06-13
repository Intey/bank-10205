import React from 'react'
import DropdownItem from './dropdownitem.jsx'

function defaultComparer(item, filterValue) {
    return item.toLowerCase().startsWith(filterValue)
}

export default class Dropdown extends React.Component{
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.state = {
            value: this.props.defaultValue,
            filterValue: '',
            matches: this.props.items,
            opened: false
        }
    }

    handleChange(account) {
        this.setState({
            value: account, filterValue: account.user.username, // sync filtering
            opened: false //close dropdown
        })
        this.props.onSelect(account)
    }

    handleInputChange(event) {
        const newFilterValue = event.target.value.toLowerCase()
        var compare = this.props.comparer || defaultComparer
        const matches = this.props.items.filter( e => compare(e, newFilterValue) )
        this.setState({
            filterValue: newFilterValue,
            matches: matches,
            opened: matches.length > 0
        })
    }

    handleFocus(event) { this.setState({ opened: true }) }

    render(){
        var idx = 0
        var dropdown_list = this.state.matches.map( item => {
            idx = idx + 1
            return (
                <DropdownItem key={idx} data={item.user.username} Click={this.handleChange.bind(this, item)} />
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
                    placeholder={this.props.placeHolder}
                    onChange={this.handleInputChange}
                    id={this.props.Id} value={this.state.filterValue}
                    onFocus={this.handleFocus}>
                </input>
                {maybeDropdown}
            </div>
        );
    }
}
