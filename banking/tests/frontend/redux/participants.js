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
var UpdateError = require(`${modules.participants}/errors.js`).UpdateError

var reducer = require(`${modules.participants}/reducers.js`).participants


describe("Participant actions", () => {
    it("should create an action to add particpant ", () => {
        const expected = { type: 'add_participant', id: 3, parts: 5.3 }
        expect(actions.addParticipant(3,5.3)).deep.equal(expected)
    })
    it("should create an action to update parts ", () => {
        const expected = { type: 'upd_parts', id: 3, parts: 2 }
        expect(actions.updateParts(3,2)).deep.equal(expected)
    })
    it("should create an action to delete particpant ", () => {
        const expected = { type: 'del_participant', id: 3 }
        expect(actions.deleteParticipant(3)).deep.equal(expected)
    })
})


describe("Participant reducers", () => {
    it("should return initial state", () => {
        reducer(undefined, {}).should.deep.equal({})
    })

    it("should add new participant, to participants list", () => {
        reducer({}, actions.addParticipant(0, 2)).should.deep.equal( {0: 2} )
        reducer({0: 2}, actions.addParticipant(1, 3.2))
          .should.deep.equal( {0: 2, 1: 3.2} )

        // add exist - no action
        reducer({0: 2}, actions.addParticipant(0, 3.2))
          .should.deep.equal( {0: 2} )
    })

    it("should update parts of exist participant", () => {
        reducer({0: 2}, actions.updateParts(0, 3)).should.deep.equal( {0: 3} )
        reducer({0: 2, 1: 3}, actions.updateParts(1, 2.4))
          .should.deep.equal( {0: 2, 1: 2.4} )

        // update unexists thow error
        expect(function reduce() {
          reducer({0: 2, 1: 3.5}, actions.updateParts(3, 8))
        }).to.throw(UpdateError)
    })

    it("should remove participant", () => {
        reducer({0: 2}, actions.deleteParticipant(0)).should.deep.equal( {} )
        reducer({0: 2, 1: 3}, actions.deleteParticipant(1)).should.deep.equal( {0: 2} )
    })
})
