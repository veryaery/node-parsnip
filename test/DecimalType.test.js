const assert = require("assert");

const { DecimalType } = require("../compiled/index.js").types;
const constants = require("./constants.js");

describe("DecimalType", () => {

    it("Parses base10 decimal 3.141592", () => {
        assert.equal((new DecimalType()).parse("3.141592", { separator: " " }).output, 3.141592);
    });

    it("Parses base10 decimal 62.831853", () => {
        assert.equal((new DecimalType()).parse("62.831853", { separator: " " }).output, 62.831853);
    });

    it("Parses base12 decimal 3.184809", () => {
        assert.equal((new DecimalType({ base: constants.base12 })).parse("3.184809", { separator: " " }).output, 3.1415925202546298);
    });

    it("Parses base12 decimal 52.9B9537", () => {
        assert.equal((new DecimalType({ base: constants.base12 })).parse("52.9B9537", { separator: " " }).output, 62.83185274937843);
    });

    it("Returns remaining string after decimal input", () => {
        assert.equal((new DecimalType()).parse("3.141592 after", { separator: " " }).remaining, " after");
    });

});