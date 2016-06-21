import $ from 'jquery'

import {csrfSafe} from '../utils/csrf.js'
import {EndPoint} from './endpoint.js'

class API {
    constructor(token) {
        this.token = token
    }

    request(settings, asQuery) {
        let headers = settings.headers || {}
        headers.Authorization = 'Token ' + this.token
        settings.headers = headers
        settings.dataType = 'json'
        settings.contentType = 'application/json; charset=utf-8'
        settings.data = JSON.stringify(settings.data)
        return csrfSafe(settings);
    }
}

/** CRUD actions for Account entity. */
export class AccountAPI extends API {
    createAccount(userdata, successFn, errorFn) {
        return this.request({
            method: "POST",
            url: EndPoint.UserList(),
            data: userdata,
            success: successFn,
            error: errorFn
        });
    }

    getUsers(successFn, errorFn) {
        return this.request({
            method: "GET",
            url: EndPoint.UserList(),
            success: successFn,
            error: errorFn
        });
    }

    findUsers(pattern, successFn, errorFn) {
        return this.request({
            method: "GET",
            url: `${EndPoint.UserList()}?search=${pattern}`,
            success: successFn,
            error: errorFn
        });

    }

    updateUser(userdata, successFn, errorFn) {
        var id = userdata.id
        delete userdata.id
        this.request({
            method: "PATCH",
            data: userdata,
            url: EndPoint.UserDetail(id),
            success: successFn,
            error: errorFn
        });
    }

    /** Add/substruct money from user balance.
     * @param {Object} data - contains user id, count, and action type -
     * income/outcome. Shape: {id: Integer, count: Float, income: Boolean}.
     * income - True, outcome - False.
     */
    transfer(data, successFn, errorFn) {
        const _data = {income: data.income, count: data.count}
        this.request({
            method: "POST",
            url: EndPoint.Transfer(data.id),
            data: _data,
            success: successFn,
            error: errorFn
        });
    }
}

/** CRUD actions for Event entity */
export class EventAPI  extends API {
    createEvent(data, successFn, errorFn){
        return this.request({
            method: "POST",
            url: EndPoint.EventList(),
            data: data,
            success: successFn,
            error: errorFn
        });
    }

    getEvents(successFn, errorFn) {
        return this.request({
            method: "GET",
            url: EndPoint.EventList(),
            success: successFn,
            error: errorFn
        });
    }

    updateEvent(data, successFn, errorFn) {
        return this.request({
            method: "PATCH",
            url: EndPoint.EventDetail(data.id),
            data: data,
            success: successFn,
            error: errorFn
        });
    }

    deleteEvent(id, successFn, errorFn) {
        return this.request({
            method: "DELETE",
            url: EndPoint.EventDetail(id),
            success: successFn,
            error: errorFn
        });
    }

    addParticipant(id, participants, successFn, errorFn) {
        this.request({
            method: "POST",
            url: EndPoint.Participants(id),
            data: participants,
            success: successFn,
            error: errorFn
        })
    }
}

export class BankAPI extends API {
    getBalance(successFn, errorFn){
        return this.request({
            method: "GET",
            url: EndPoint.BankBalance(),
            success: successFn,
            error: errorFn
        });
    }
}

export class AuthAPI extends API {
    auth(data, successFn, errorFn) {
        return this.request({
            method: "POST",
            data: data,
            url: EndPoint.Auth(),
            success: successFn,
            error: errorFn
        })
    }
}
