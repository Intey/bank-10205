import React from 'react'

export default class DropdownItem extends React.Component{
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    // send given data to onClick to determine which item clicked.
    handleChange(event) { this.props.Click(this.props.data) }

    render(){
        return (
            <li onClick={this.handleChange}>
                <a href="javascript:void(0)">{this.props.data}</a>
            </li>
        );
    }
}

