import React from 'react'
import DropdownItem from './dropdownitem.jsx'

import {identity} from '../utils/etc.js'


export default class Dropdown extends React.Component{
    constructor(props) {
        super(props)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.defaultFilter = this.defaultFilter.bind(this)

        const toString = this.props.toString || identity
        const filterValue = toString(this.props.defaultValue)
        this.state = {
            value: this.props.defaultValue,
            filterValue: filterValue,
            matches: [this.props.defaultValue],
            opened: false
        }

        // part of handing click outside of dropdown or input
        const doc = window.document
        doc.addEventListener('click', e => this.handleBlur(e), false)
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
    handleSelect(item) {
        const toString = this.props.toString || identity
        this.setState({
            value: item,
            filterValue: toString(item), // sync filtering
            matches: [item],
            opened: false //close dropdown
        })
        this.props.onSelect(item)
    }

    /**
     * When input value change.
     * @param {Object} event sintetic event with value in input
     */
    handleInputChange(event) {
        const newFilterValue = event.target.value.toLowerCase()
        const items = this.props.items
        const filter = this.props.filter || this.defaultFilter
        const matches = items.filter( e => filter(e, newFilterValue) )

        this.setState({
            filterValue: newFilterValue,
            matches: matches,
            opened: matches.length > 0
        })
    }

    defaultFilter(item, filterValue) {
        const toString = this.props.toString || identity
        return toString(item).toLowerCase().startsWith(filterValue)
    }

    handleFocus(event) { this.setState({ opened: true }) }

    render(){
        const toString = this.props.toString || identity
        var dropdown_list = this.state.matches.map( (item, idx) => {
            return (
                <DropdownItem key={idx} data={toString(item)}
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
