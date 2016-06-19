import React from 'react'
import DropdownItem from './dropdownitem.jsx'

function defaultFilter(item, filterValue) {
    return item.toLowerCase().startsWith(filterValue)
}

export default class Dropdown extends React.Component{
    constructor(props) {
        super(props)
        this.handleSelect = this.handleSelect.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        this.state = {
            value: this.props.defaultValue,
            filterValue: '',
            matches: this.props.items,
            opened: false
        }

        // part of handing click outside of dropdown or input
        const doc = window.document;
        doc.addEventListener('click', e => this.handleBlur(e), false)
    }

    /**
     * Hack getting props by AJAX request, simply set it in constructor cause
     * matches == []
     */
    componentWillReceiveProps(props) {
        this.setState({
            value: props.defaultValue,
            matches: props.items,
        })
    }

    /**
     * When click outside of dropdown or input - hide dropdown
     * @param {NativeEvent} e click event from native 'addEventListener'
     */
    handleBlur(e) {
        if (e.target.id != 'no-hide') this.setState({ opened: false })
    }

    /**
     * When item in dropdown clicked
     * @param {Object} account one of props.items
     */
    handleSelect(account) {
        this.setState({
            value: account, filterValue: account.user.username, // sync filtering
            matches: [account],
            opened: false //close dropdown
        })
        this.props.onSelect(account)
    }

    /**
     * When input value change.
     * @param {Object} event sintetic event with value in input
     */
    handleInputChange(event) {
        const newFilterValue = event.target.value.toLowerCase()
        const items = this.props.items
        const filter = this.props.filter || defaultFilter
        const matches = items.filter( e => filter(e, newFilterValue) )

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
                <DropdownItem key={idx} data={item.user.username}
                    Click={this.handleSelect.bind(this, item)}
                    />
            )
        })
        var maybeDropdown = this.state.opened ?
            <ul className="dropdown-menu">
                {dropdown_list}
            </ul>
            : null

        // className on div - simulate bootstrap open change
        // id 'no-hide' is a part of hiding dropdown on clicking outside
        return (
            <div className={'dropdown '+(this.state.opened ? "open": "")} >
                <input type="text" className="form-control"
                    id='no-hide'
                    placeholder={this.props.placeHolder}
                    onChange={this.handleInputChange}
                    value={this.state.filterValue}
                    onFocus={this.handleFocus}>
                </input>
                {maybeDropdown}
            </div>
        );
    }
}
