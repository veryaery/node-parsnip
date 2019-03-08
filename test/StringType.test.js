const assert = require("assert");

const { StringType } = require("../compiled/index.js").types;

describe("StringType", () => {

    it("Parses string before separator", () => {
        assert.equal((new StringType()).parse("before after", { separator: " " }).output, "before");
    });

    it("Returns remaining string after string input", () => {
        assert.equal((new StringType()).parse("before after", { separator: " " }).remaining, " after");
    });

    it("Parses string containing escaped quote string", () => {
        assert.equal((new StringType()).parse("\\\"", { separator: " " }).output, "\"");
    });

    it("Parses string containing escaped escape string", () => {
        assert.equal((new StringType()).parse("\\\\", { separator: " " }).output, "\\");
    });

    it("Parses string containing escaped quote string more than 1 character long", () => {
        assert.equal((new StringType({ quotation: "quote" })).parse("\\quote", { separator: " " }).output, "quote");
    });

    it("Throws Fault if escape string is at end of input", () => {
        try {
            (new StringType()).parse("\\", { separator: " " });
        } catch (error) {
            if (error.name == "Fault") {
                return;
            }
        }

        throw new Error();
    });

    it("Parses quoted string containing separator", () => {
        assert.equal((new StringType()).parse("\"foo bar\" after", { separator: " " }).output, "foo bar");
    });

    it("Parses quoted string containing other quote string", () => {
        assert.equal((new StringType()).parse("\"'\"", { separator: " " }).output, "'");
    });

    it("Parses quoted string quoted with quote string more than 1 characters long", () => {
        assert.equal((new StringType({ quotation: "quote" })).parse("quotefoo barquote", { separator: " " }).output, "foo bar");
    });

    it("Throws Fault if quoted string isn't immediately followed by a separator", () => {
        try {
            (new StringType()).parse("\"foo bar\"apa bapa", { separator: " " });
        } catch (error) {
            if (error.name == "Fault") {
                return;
            }
        }

        throw new Error();
    });

    it("Throws Fault if string is shorter than minimum", () => {
        try {
            (new StringType({ min: 4 })).parse("foo", { separator: " " });
        } catch (error) {
            if (error.name == "Fault") {
                return;
            }
        }

        throw new Error();
    });

    it("Throws Fault if string is longer than maximum", () => {
        try {
            (new StringType({ max: 2 })).parse("bar", { separator: " " });
        } catch (error) {
            if (error.name == "Fault") {
                return;
            }
        }

        throw new Error();
    });

});