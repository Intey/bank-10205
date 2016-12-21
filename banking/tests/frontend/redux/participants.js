import jsdom from 'mocha-jsdom'

import sinon from 'sinon'
import {expect, assert} from 'chai'
var should = require('chai').should() // actually call the function

import proxyquire from 'proxyquire'

import TestUtils from 'react-addons-test-utils'
import React from 'react'
import ReactDOM from 'react-dom'

import modules from '../helpers/defines.js'

var actions = require(`${modules.participants}/actions.js`)
var setError = require(`${modules.participants}/errors.js`).setError

describe("Participant actions", () => {
    it("should create an action to add particpant ", () => {
        const expected = { type: 'add_participant', id: 3, parts: 5.3 }
        expect(actions.addParticipant(3,5.3)).deep.equal(expected)
    })
    it("should create an action to set parts ", () => {
        const expected = { type: 'set_parts', parts: 2 }
        expect(actions.setParts(2)).deep.equal(expected)
    })
    it("should create an action to delete particpant ", () => {
        const expected = { type: 'del_participant', id: 3 }
        expect(actions.deleteParticipant(3)).deep.equal(expected)
    })
})

var reducer = require(`${modules.participants}/reducers.js`).participants
describe("Participant reducers", () => {
    it("should return initial state", () => {
        reducer(undefined, {}).should.deep.equal({})
    })

    it("should add new participant, to participants list", () => {
        reducer({0: 2}, actions.addParticipant(1, 3.2))
          .should.deep.equal( {0: 2, 1: 3.2} )

        // add exist - update
        reducer({0: 2}, actions.addParticipant(0, 3.2))
          .should.deep.equal( {0: 3.2} )
    })

    it("should remove participant", () => {
        reducer({0: 2}, actions.deleteParticipant(0)).should.deep.equal( {} )
        reducer({0: 2, 1: 3}, actions.deleteParticipant(1)).should.deep.equal( {0: 2} )
    })
})

var adderReduc = require(`${modules.participants}/reducers.js`).adder
describe("Adder reduces", function() {
    it("should set parts", () => {
        adderReduc({id: 0, parts: 2}, actions.setParts(3))
            .should.deep.equal( {id : 0, parts: 3} )
        adderReduc({id: 1, parts: 3}, actions.setParts(2.4))
            .should.deep.equal( {id :1, parts: 2.4} )
    })
})
