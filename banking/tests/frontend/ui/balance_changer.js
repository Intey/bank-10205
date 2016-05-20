import jsdom from 'mocha-jsdom'

import sinon from 'sinon'
import {expect, assert} from 'chai'
var should = require('chai').should() // actually call the function

import proxyquire from 'proxyquire'

import TestUtils from 'react-addons-test-utils'
import React from 'react'
import ReactDOM from 'react-dom'

import modules from '../helpers/defines.js'

var BalanceChanger =
    proxyquire(`${modules.components_dir}/BalanceChanger`, {
    '../domain/api.js': {
        'AccountAPI': {
            transfer: function(data, succ, err) { return 'bitches' }
        }
    }
}).default

describe("When BalanceChanger", function() {
    var $ // predef


    describe('gets from user correct value and click "Пополнить"', function() {
        beforeEach(function() {
            $ = require('jquery'); sinon.stub($, 'ajax') // stub

        });

        const balance_changer =
            TestUtils.renderIntoDocument(<BalanceChanger/>)

        this.value_input =
            TestUtils.scryRenderedDOMComponentsWithTag(balance_changer,
                                                       'input')
        this.send_button =
            TestUtils.findRenderedDOMComponentWithTag(balance_changer,
                                                      'button')


        this.value_input.value = 3000;
        TestUtils.Simulate.change(this.value_input);
        TestUtils.Simulate.click(this.send_button);

        it("it sould call AccountAPI transfer", function() {
            var p = $.ajax.getCall(0).args[0]
            p.url.should.to.be.equal('/api/users/1/balance')
            p.method.should.to.be.equal('POST')
            p.data.should.to.be.equal(
                JSON.stringify({ count: 3000, income: true })
            )

        });
        afterEach(function() {
            $.ajax.restore()
        });
    });
});
