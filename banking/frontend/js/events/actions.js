import eventId          from '../domain/hacks/event.js'
import { EventAPI }     from '../domain/api.js'
import getToken         from '../utils/token.js'
import { dateToSimple } from '../utils/string.js'
import { Types }        from './action.types.js'

const API = new EventAPI(getToken())


export function setAuthor(authorId) {
    return {
        type: Types.SET_AUTHOR,
        payload: authorId
    }
}

export function setName(name) {
    return {
        type: Types.SET_NAME,
        payload: name
    }
}

export function setDate(date) {
    return {
        type: Types.SET_DATE,
        payload: date
    }
}

export function setPrice(price) {
    return {
        type: Types.SET_PRICE,
        payload: price
    }
}

export function saveRequest() {
    return {
        type: Types.SAVE_REQUEST,
        payload: null
    }
}

export function saveSuccess(event) {
    return {
        type: Types.SAVE_SUCCESS,
        payload: event
    }
}

export function saveFailure(error) {
    return {
        type: Types.SAVE_FAILURE,
        payload: error
    }
}

export function save() {
    return (dispatch, getState) => {
        const state = getState()

        const authorId = state.users[state.event.author].id

        dispatch(saveRequest())

        API.updateEvent(
            { ...state.event, id: eventId(), date: dateToSimple(state.event.date), author: authorId},
            (resp) => dispatch(saveSuccess(resp)),
            (resp) => dispatch(saveFailure(resp))
        )
    }
}

export function create() {
    return (dispatch, getState) => {
        const state = getState()
        const authorId = state.users[state.event.author].id
        dispatch(saveRequest())

        API.createEvent(
            state.event,
            (resp) => dispatch(saveSuccess(resp)),
            (resp) => dispatch(saveFailure(resp))
        )
    }
}
