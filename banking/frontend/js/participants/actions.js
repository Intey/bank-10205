import { Types } from './action.types.js'

export function addParticipant () {
    return {
        type: Types.ADD_PARTICIPANT,
    }
}

export function setParticipant(id) {
    return {
        type: Types.SET_PARTICIPANT,
        id: id
    }
}

export function setParts (id, parts) {
    return {
        type: Types.SET_PARTS,
        id: id,
        parts: parts
    }
}

export function deleteParticipant (id) {
    return {
        type: Types.DEL_PARTICIPANT,
        id: id
    }
}
