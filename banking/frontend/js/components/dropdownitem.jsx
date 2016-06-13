import React from 'react'

export default class DropdownItem extends React.Component{
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    // send given data to onClick to determine which item clicked.
    handleChange(event) {
        this.props.Click(this.props.data)
        event.preventDefault()
    }

    render(){
        return (
            <li >
                <a onClick={this.handleChange}>{this.props.data}</a>
            </li>
        );
    }
}

