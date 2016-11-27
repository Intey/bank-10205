import { participantList }    from './components/List.jsx'
import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import { deleteParticipant }  from './actions.js'

function mapStateToProps (state) {
    return {
        users: state.users,
        participants: state.participants
    }
}

function mapDispatchProps (dispatch) {
    return {
        onRemoveClick: bindActionCreators(deleteParticipant, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchProps)(participantList)
