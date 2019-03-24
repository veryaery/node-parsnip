const assert = require("assert");

const { BooleanType } = require("../compiled/index.js").types;

describe("BooleanType", () => {

    it("Parses true value", () => {
        assert.equal((new BooleanType()).parse("true", { separator: [ " " ]}).output, true);
    });

    it("Parses false value", () => {
        assert.equal((new BooleanType()).parse("false", { separator: [ " " ]}).output, false);
    });

    it("Returns remaining string after true value", () => {
        assert.equal((new BooleanType()).parse("true after", { separator: [ " " ]}).remaining, " after");
    });

    it("Returns remaining string after false value", () => {
        assert.equal((new BooleanType()).parse("false after", { separator: [ " " ]}).remaining, " after");
    });

    it("Throws Fault if an invalid input was provided", () => {
        try {
            (new BooleanType()).parse("invalid", { separator: [ " " ]});
        } catch (error) {
            if (error.name == "Fault") {
                return;
            }
        }

        throw new Error();
    });

});