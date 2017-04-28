import React from 'react'

export default class Button extends React.Component{
   render(){
       return (
           <a href={this.props.Link} className={this.props.Class} id={this.props.Id} onClick={this.props.Click}>
                <span className={this.props.Icon}></span> {this.props.Caption}
            </a>
       );
   }
}

export class SubmitButton extends React.Component {
    render() {
        return (
            <button type="button" className="form-control btn btn-success"
                form={this.props.Form} onClick={this.props.Click}>
                {this.props.Caption}
            </button>
        );
    }
}

