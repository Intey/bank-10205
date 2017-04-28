import sinon from 'sinon'
import {expect, assert} from 'chai'
var should = require('chai').should() // actually call the function

import modules from '../helpers/defines.js'

describe('When call API', function() {
    let $;
    beforeEach(function() {
        $ = require('jquery'); // include jquery
        sinon.stub($, 'ajax');
        const AuthAPI = require(modules.api).AuthAPI

        this.API = new AuthAPI("AuthToken")
        this.EndPoint = require(modules.endpoints).EndPoint
    });

    describe('auth with correct data', function() {
        it('should response with correct user data', function() {
            const data = {username: "intey", password:'1'}
            var data_str = JSON.stringify(data)
            var onSuccess = sinon.stub(),
                onError = sinon.stub()
            this.API.auth(data, onSuccess, onError);
            $.ajax.yieldTo('success', Object.assign({id: 12, is_superuser:true}, data))

            var p = $.ajax.getCall(0).args[0]
            p.data.should.to.be.a('string')

            assert.equal(p.data, data_str)
            assert.equal(p.url, this.EndPoint.Auth())
            expect(onSuccess.called).to.be.true
        });
    });

    afterEach(function() {
        $.ajax.restore();
    });
});
