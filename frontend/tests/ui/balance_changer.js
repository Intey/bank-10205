import jsdom from 'mocha-jsdom'

import sinon from 'sinon'
import {expect, assert} from 'chai'
var should = require('chai').should() // actually call the function

import proxyquire from 'proxyquire'

import TestUtils from 'react-addons-test-utils'
import React from 'react'
import ReactDOM from 'react-dom'

import modules from '../helpers/defines.js'

describe("When BalanceChanger", function() {
    var $ // predef

    before(function() { this.userId = 15 });

    beforeEach(function() {
        $ = require('jquery'); sinon.stub($, 'ajax') // stub
    })


    describe('gets from user correct value and submit', function() {
        var transfer_stub = sinon.stub()
        var AccountAPI_stub = function() {}
        AccountAPI_stub.prototype.transfer = transfer_stub

        var BalanceChanger =
            proxyquire(`${modules.components_dir}/BalanceChanger`, {
            '../domain/api.js': { AccountAPI: AccountAPI_stub },
            '../utils/token.js': { default: function() { return 'token' } }
        }).default

        const balance_changer =
            TestUtils.renderIntoDocument(<BalanceChanger userId={this.userId}/>)

        this.value_input =
            TestUtils.scryRenderedDOMComponentsWithTag(balance_changer,
                                                       'input')[0]
        this.send_button =
            TestUtils.findRenderedDOMComponentWithTag(balance_changer,
                                                      'button')

        this.value_input.value = 3000
        TestUtils.Simulate.change(this.value_input);
        TestUtils.Simulate.click(this.send_button);

        it("it sould call AccountAPI transfer", function() {
            var {count, income} = transfer_stub.getCall(0).args[0]
            count.should.to.be.equal(3000)
            income.should.to.be.true
        })

    })


    describe("gets from user float value and submit", function() {
        var transfer_stub = sinon.stub()
        var AccountAPI_stub = function() {}
        AccountAPI_stub.prototype.transfer = transfer_stub

        var BalanceChanger =
            proxyquire(`${modules.components_dir}/BalanceChanger`, {
            '../domain/api.js': { AccountAPI: AccountAPI_stub },
            '../utils/token.js': { default: function() { return 'token' } }
        }).default

        const balance_changer =
            TestUtils.renderIntoDocument(<BalanceChanger userId={this.userId}/>)

        this.value_input =
            TestUtils.scryRenderedDOMComponentsWithTag(balance_changer,
                                                       'input')[0]
        this.send_button =
            TestUtils.findRenderedDOMComponentWithTag(balance_changer,
                                                      'button')

        this.value_input.value = 200.50
        TestUtils.Simulate.change(this.value_input);
        TestUtils.Simulate.click(this.send_button);

        it("it sould call AccountAPI transfer", function() {
            var {count, income} = transfer_stub.getCall(0).args[0]
            count.should.to.be.equal(200.50)
        })

    });

    afterEach(function() {
        $.ajax.restore()
    })
})
