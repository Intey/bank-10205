import { Types } from './action.types.js'

export function addParticipant (id, parts) {
    return {
        type: Types.ADD_PARTICIPANT,
        id: id,
        parts: parts
    }
}

export function updateParts (id, parts) {
    return {
        type: Types.UPD_PARTS,
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
