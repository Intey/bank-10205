import { Snackbar } from 'material-ui'
import { connect }  from 'react-redux'
import { closeSnack } from './actions.js'

function mapStatePropsSnack(state) {
    return {
        open: state.snackbar.open,
        message: state.snackbar.message,
        autoHideDuration: 3000,
    }
}

function mapDispatchToPropsSnack(dispatch) {
    return {
        onRequestClose: () => dispatch(closeSnack())
    }
}

var SnackbarContainer = connect(mapStatePropsSnack, mapDispatchToPropsSnack)(Snackbar)
export default SnackbarContainer
