import {expect, assert} from 'chai'
var should = require('chai').should() // actually call the function

import modules from '../helpers/defines.js'

var leftpad = require(`${modules.utils}/string`).leftpad
var dateToSimple = require(`${modules.utils}/string`).dateToSimple

describe("When call leftpad", function() {
    describe("with incorrect params:", function() {
        it("if all empty - return empty string", function() {
            leftpad().should.equal('')
        })
        it("if empty pad char - pad with space", function() {
            leftpad('string', '', 8).should.equal('  string')
        })
        it("if size given, but else is empty - return spaces", function() {
            leftpad('', '', 2).should.equal('  ')
        });
    })
    describe("with strings", function() {
        it("should create pad with to fit in given size", function() {
            leftpad('monokai', '000', 10).should.equal('000monokai')
        })
    })
    describe("with numbers should convert them to strings and", function() {
        it("should return string", function() {
            leftpad(5, 0, 2).should.equal('05')
            leftpad(7, 12, 5).should.equal('12127')
        })

        describe("and pad not fit in size", function() {
            it("shoud pad as many as possible, but save target string", function() {
                leftpad(7, 12, 4).should.equal('1217')
                leftpad(333, 345, 7).should.equal('3453333')
            })
        })
        describe("and pad exactly fix in size", function() {
            it("should pad", function() {
                leftpad(333, 345, 9).should.equal('345345333')
            });
        });
    })
})

describe("DateToSimple", function() {
    it("Should create fill day with 0", function() {
        var d = new Date()
        d.setYear('2016')
        d.setMonth('5') // 5 is June, couze from zero
        d.setDate('2')
        dateToSimple(d).should.equal('2016-06-02')
    })
})
