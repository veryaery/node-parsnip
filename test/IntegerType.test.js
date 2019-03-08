const assert = require("assert");

const { IntegerType } = require("../compiled/index.js").types;
const constants = require("./constants.js");

describe("IntegerType", () => {

    it("Parses base10 integer 69", () => {
        assert.equal((new IntegerType()).parse("69", { separator: " " }).output, 69);
    });

    it("Parses base10 integer 1337", () => {
        assert.equal((new IntegerType()).parse("1337", { separator: " " }).output, 1337);
    });

    it("Parses base12 integer 59", () => {
        assert.equal((new IntegerType({ base: constants.base12 })).parse("59", { separator: " " }).output, 69);
    });

    it("Parses base12 integer 935", () => {
        assert.equal((new IntegerType({ base: constants.base12 })).parse("935", { separator: " " }).output, 1337);
    });

    it("Returns remaining string after integer input", () => {
        assert.equal((new IntegerType()).parse("69 after", { separator: " " }).remaining, " after");
    });

});