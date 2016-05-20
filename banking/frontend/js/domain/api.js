import {csrfSafe} from '../utils/csrf.js'
import {EndPoint} from './endpoint.js'
import $ from 'jquery'

class API {
    constructor(token) {
        this.token = token
    }

    request(settings) {
        let headers = settings.headers || {}
        headers.Authorization = 'Token ' + this.token
        settings.headers = headers
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

    updateUser(userdata, successFn, errorFn) {
        var id = userdata.id
        delete userdata.id
        this.request({
            method: "PATCH",
            url: EndPoint.UserDetail(id),
            success: successFn,
            error: errorFn
        });
    }

    /** Add/substruct money from user balance.
     * @param {Object} data - contains user id, count, and action type -
     * income/outcome. Shape: {id: Integer, count: Float, income: Boolean}.
     */
    transfer(data, successFn, errorFn) {
        this.request({
            method: "POST",
            url: EndPoint.Transfer(data),
            success: successFn,
            error: errorFn
        });
    }


}

/** CRUD actions for Event entity */
export class EventAPI  extends API{
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

}
