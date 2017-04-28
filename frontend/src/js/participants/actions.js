import { Types } from './action.types.js'

export function addParticipant (id, parts) {
    return {
        type: Types.ADD_PARTICIPANT,
        id: id,
        parts: parts
    }
}

export function setParticipant(id) {
    return {
        type: Types.SET_PARTICIPANT,
        id: id
    }
}

export function setParts(parts) {
    return {
        type: Types.SET_PARTS,
        parts: parts
    }
}

export function deleteParticipant (id) {
    return {
        type: Types.DEL_PARTICIPANT,
        id: id
    }
}
