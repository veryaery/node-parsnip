const assert = require("assert");

const { NumberType } = require("../compiled/classes/NumberType.js");

const base12 = [
    [ "0" ], [ "1" ], [ "2" ],
    [ "3" ], [ "4" ], [ "5" ],
    [ "6" ], [ "7" ], [ "8" ],
    [ "9" ], [ "A" ], [ "B" ]
];

describe("NumberType", () => {

    describe("parse_input", () => {

        it("Parses base10 integer", () => {
            assert.deepEqual((new NumberType(null, NumberType.default_options)).parse_input("1337", { separator: [ " " ] }).indexes, [ [ 1, 3, 3, 7 ], [] ]);
        });

        it("Parses base12 integer", () => {
            assert.deepEqual((new NumberType({ base: base12 }, NumberType.default_options)).parse_input("935", { separator: [ " " ] }).indexes, [ [ 9, 3, 5 ], [] ]);
        });

        it("Parses base10 decimal", () => {
            assert.deepEqual((new NumberType(null, NumberType.default_options)).parse_input("3.141592", { separator: [ " " ] }).indexes, [ [ 3 ], [ 1, 4, 1, 5, 9, 2 ] ]);
        });

        it("Parses base12 decimal", () => {
            assert.deepEqual((new NumberType({ base: base12 }, NumberType.default_options)).parse_input("3.184809", { separator: [ " " ] }).indexes, [ [ 3 ], [ 1, 8, 4, 8, 0, 9 ] ]);
        });

        it("Returns remaining string after integer", () => {
            assert.equal((new NumberType(null, NumberType.default_options)).parse_input("1337 after", { separator: [ " " ] }).remaining, " after");
        });

        it("Returns remaining string after decimal", () => {
            assert.equal((new NumberType(null, NumberType.default_options)).parse_input("3.141592 after", { separator: [ " " ] }).remaining, " after");
        });

        it("Parses positive number", () => {
            assert.equal((new NumberType(null, NumberType.default_options)).parse_input("1337", { separator: [ " " ] }).negative, false);
        });

        it("Parses negative number", () => {
            assert.equal((new NumberType(null, NumberType.default_options)).parse_input("-1337", { separator: [ " " ] }).negative, true);
        });

        it("Ignores ignore strings", () => {
            assert.deepEqual((new NumberType(null, NumberType.default_options)).parse_input("1'337", { separator: [ " " ] }).indexes, [ [ 1, 3, 3, 7 ], [] ]);
        });

        it("Throws Fault if number string isn't followed by a separator", () => {
            try {
                (new NumberType(null, NumberType.default_options)).parse_input("1337foo bar", { separator: [ " " ] })
            } catch (error) {
                if (error.name == "Fault") {
                    return;
                }
            }
    
            throw new Error();
        });

        it("Throws Fault if number string doesn't contain any digits", () => {
            try {
                (new NumberType(null, NumberType.default_options)).parse_input("-.", { separator: [ " " ] })
            } catch (error) {
                if (error.name == "Fault") {
                    return;
                }
            }
    
            throw new Error();
        });

    });

    describe("parse_number", () => {

        it("Parses base10 integer", () => {
            assert.equal((new NumberType(null, NumberType.default_options)).parse_number([ [ 1, 3, 3, 7 ], [] ], false), 1337);
        });

        it("Parses base10 decimal", () => {
            assert.equal((new NumberType(null, NumberType.default_options)).parse_number([ [ 3 ], [ 1, 4, 1, 5, 9, 2 ] ], false), 3.141592);
        });

        it("Parses base12 integer", () => {
            assert.equal((new NumberType({ base: base12 }, NumberType.default_options)).parse_number([ [ 9, 3, 5 ], [] ], false), 1337);
        });

        it("Parses base12 decimal", () => {
            assert.equal(Math.floor((new NumberType({ base: base12 }, NumberType.default_options)).parse_number([ [ 3 ], [ 1, 8, 4, 8, 0, 9 ] ], false) * 1000000) / 1000000, 3.141592);
        });

        it("Parses negative number", () => {
            assert.equal((new NumberType(null, NumberType.default_options)).parse_number([ [ 1, 3, 3, 7 ], [] ], true), -1337);
        });

    });

    describe("validate", () => {

        it("Throws Fault if number is smaller than minimum", () => {
            try {
                (new NumberType({ min: 2 }, NumberType.default_options)).validate(1, "", "");
            } catch (error) {
                if (error.name == "Fault") {
                    return;
                }
            }
    
            throw new Error();
        });

        it("Throws Fault if number is larger than maximum", () => {
            try {
                (new NumberType({ max: 1 }, NumberType.default_options)).validate(2, "", "");
            } catch (error) {
                if (error.name == "Fault") {
                    return;
                }
            }
    
            throw new Error();
        });

    });

});