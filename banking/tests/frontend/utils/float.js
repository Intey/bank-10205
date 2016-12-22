import {expect, assert} from 'chai'

var should = require('chai').should() // actually call the function

import modules from '../helpers/defines.js'

var fixFloat = require(`${modules.utils}/float`).fixFloat

describe("fixFload should convert", function() {

    it("int to int", function() {
        fixFloat("12"  ).should.equal("12")
        fixFloat("12"  ).should.equal("12")
    });

    it("last dot to last dot", function() {
        fixFloat("12." ).should.equal("12.")
        fixFloat("123.").should.equal("123.")
    });

    it("correct float string to correct float string ", function() {
        fixFloat("12.3").should.equal("12.3")
        fixFloat("934.7379273").should.equal("934.7379273")
    });

    it("broken int part to zero", function() {
        fixFloat("d334").should.equal("0")
        fixFloat("33s").should.equal("33")
        fixFloat("3s0s3").should.equal("3")
    });

    it("broken float part to as much correct as can", function() {
        fixFloat("12.k"       ).should.equal("12.")
        fixFloat("12.011k"    ).should.equal("12.011")
        fixFloat("12.123d9").should.equal("12.123")

    });

    describe("zero values", function() {

        it("in int part", function() {
            fixFloat("0").should.equal("0")
            fixFloat("000").should.equal("0")
            fixFloat("0001").should.equal("1")
        });

        it("in float part", function() {
            fixFloat("12.0" ).should.equal("12.0")
            fixFloat("87.0000" ).should.equal("87.0000")
            fixFloat("42.0001" ).should.equal("42.0001")
        });

        it("mixed in float", function() {
            fixFloat("0.0" ).should.equal("0.0")
            fixFloat("0.01010" ).should.equal("0.01010")
        });

    });

    it("letter after zero in float", function() {
        fixFloat("0.010s" ).should.equal("0.010")
        fixFloat("0.0s" ).should.equal("0.0")
        fixFloat("0.000123s" ).should.equal("0.000123")
    });

    // it("apped or cut, when size is given", function() {
    //     fixFloat("0.0111", 2).should.equal("0.01")
    //     fixFloat("0.0111", 3).should.equal("0.011")
    //     fixFloat("0.01", 3).should.equal("0.010")
    //     fixFloat("0", 2).should.equal("0.00")
    //     fixFloat("0.", 2).should.equal("0.00")
    //     fixFloat("0.", 5).should.equal("0.00000")
    // });

    it("float to float", function() {
        fixFloat(12.22).should.equal("12.22")
        fixFloat(12.222).should.equal("12.222")
    });
    it("undefined to 0", function() {
        fixFloat(undefined).should.equal("0")
        fixFloat(undefined).should.equal("0")
        fixFloat(null).should.equal("0")
        fixFloat(null).should.equal("0")
        fixFloat(null).should.equal("0")
    });
});

