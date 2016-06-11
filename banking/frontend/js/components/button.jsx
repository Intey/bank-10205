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
            <div className="btn-group col-md-12">
                <button type="button" className="btn btn-success col-md-12"
                id="sigin-button" form="auth-form" onClick={this.props.Click}>
                    {this.props.Caption}
                </button>
            </div>
        );
    }
}

