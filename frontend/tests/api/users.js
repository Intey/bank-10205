import sinon from 'sinon'
import {expect, assert} from 'chai'
var should = require('chai').should() // actually call the function

import modules from '../helpers/defines.js'


describe("When call API", function() {
    var $
    before(function() {
        $ = require('jquery')
        sinon.stub($, 'ajax')
        const AccountAPI = require(modules.api).AccountAPI

        this.API = new AccountAPI("AuthToken")
        this.EndPoint = require(modules.endpoints).EndPoint
        this.userdata = {
            username: 'intey',
            first_name: 'Babaika',
            last_name: 'Olala',
        }
    })

    describe("createAccount", function() {
        it('should POST to user list path and call success on success',
           function() {
            var userdata = {username: "test", password: "test"}
            var data_str = JSON.stringify(userdata)
            const successFn = sinon.spy()

            // request
            this.API.createAccount(userdata, successFn, sinon.stub())
            // response
            $.ajax.yieldTo('success', userdata)

            var p = $.ajax.getCall(0).args[0]
            p.data.should.to.be.a('string')

            assert.equal(p.data, data_str)
            assert.equal(p.url, this.EndPoint.UserList())

            expect(successFn.called).to.be.true

            $.ajax.reset()

            userdata = {username: "Bobby", password: "123"}
            data_str = JSON.stringify(userdata)
            const successFn2 = sinon.spy();

            this.API.createAccount(userdata, successFn2)
            $.ajax.yieldTo('success', userdata)

            var p = $.ajax.getCall(0).args[0]
            p.data.should.to.be.equal(data_str)
            assert.equal(p.url, this.EndPoint.UserList())

            expect(successFn2.called).to.be.true
        })

    })
    describe("getUsers", function() {
        it('should GET to user list path and call success on success',
           function() {
            let successFn = sinon.spy()

            // request
            this.API.getUsers(successFn, sinon.stub())
            $.ajax.getCall(0).args[0].url.should.equal('/api/users/')
            // response
            $.ajax.yieldTo('success', [this.userdata, this.userdata])


            expect(successFn.called).to.be.true
        });
    })

    describe("updateUser", function() {
        it('should PUT to user detail path and call success on success',
           function() {
            let successFn = sinon.spy()
            const data = {id: 1, username: "Test", birthdate: new Date()}
            const userDetail = this.EndPoint.UserDetail(data.id);

            // request
            this.API.updateUser(data, successFn)
            // response
            $.ajax.yieldTo('success', [this.userdata, this.userdata])

            const p = $.ajax.getCall(0).args[0]
            p.data.should.to.be.a('string') //json coded
            p.method.should.to.be.equal('PUT');
            p.url.should.to.be.equal(`${userDetail}`)

            expect(successFn.called).to.be.true
        });
    })

    describe("transfer", function() {
        it("should create POST on money api", function() {
            const send_data = {
                id:0,
                count:3000,
                income:true
            }
            const successFn = sinon.spy()
            this.API.transfer(send_data, successFn, sinon.stub())
            $.ajax.yieldTo('success', {balance: 4000})

            var {url, data} = $.ajax.getCall(0).args[0]
            data.should.to.be.a('string') // send coded json
            data = JSON.parse(data)
            url.should.to.be.equal(this.EndPoint.Transfer(0))
            data.count.should.to.be.equal(3000)

            expect(successFn.called).to.be.true
        })
    })

    describe("findUser", function() {
        it('should GET to user list path with queryparam "search" and call'+
            'success on success',
           function() {
            let successFn = sinon.spy()

            // request
            this.API.findUsers('int', successFn, sinon.stub())
            $.ajax.getCall(0).args[0].url.should.equal('/api/users/?search=int')
            // response
            $.ajax.yieldTo('success', [this.userdata, this.userdata])

            expect(successFn.called).to.be.true
        });

    })
    afterEach(function() { $.ajax.reset() })
    after(function() { $.ajax.restore() });
})

