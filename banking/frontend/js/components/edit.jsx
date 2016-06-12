import React from 'react'

/** Component for Edit something. Can be highlighted with error state, and show
 * error message.
 * @param {String} Type of input, that represent edit value
 * @param {String, Number or Date} Value initial of input
 * @param {String} FormName that for input will be attached
 * @param {Function} Change callback, on changing.
 * @param {Function} Focus callback, on focus.
 * @param {Bool or String} Error error object. When passed bool, just
 * highlight(red) input. If passed String then show under input help-block with
 * error message. Commonly, if you show error on parent, just spend there True,
 * Else - spend error message and it's will be showed under input.
 */
export default class Edit extends React.Component{
    render(){
        const error = this.props.Error
        let highlight_class = !!error ? "has-error" : ""
        var errorHelper = typeof(error) === "string" ?
            <span className="help-block">{error}</span> : null
        return (
            <div className={"form-group " + highlight_class}>
                <label for={this.props.Label} className="control-label col-sm-3 col-md-3 col-lg-3">
                    {this.props.Label}
                </label>
                <div className="col-lg-9 col-md-9 col-sm-9">
                    <input type={this.props.Type} id={this.props.Label} className="form-control"
                        value={this.props.Value} form={this.props.FormName}
                        onChange={this.props.Change} onFocus={this.props.Focus}/>
                </div>
                {errorHelper}
            </div>
        );
    }
}
