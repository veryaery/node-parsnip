const assert = require("assert");

const { Str } = require("../compiled/types/Str.type.js");

describe("Str", () => {

    it("Returns output as parsed string before separator", () => {
        assert.equal((new Str()).parse("before after", { separator: " " }).output, "before");
    });

    it("Returns remaining as remaining string after output", () => {
        assert.equal((new Str()).parse("before after", { separator: " " }).remaining, " after");
    });

    it("Returns output as parsed string containing escaped quote string", () => {
        assert.equal((new Str()).parse("\\\"", { separator: " " }).output, "\"");
    });

    it("Returns output as parsed string containing escaped escape string", () => {
        assert.equal((new Str()).parse("\\\\", { separator: " " }).output, "\\");
    });

    it("Returns output as parsed string containing escaped quote string more than 1 character long", () => {
        assert.equal((new Str({ quotation: "quote" })).parse("\\quote", { separator: " " }).output, "quote");
    });

    it("Throws Fault if escape string is at end of input", () => {
        try {
            (new Str()).parse("\\", { separator: " " });
        } catch (error) {
            if (error.name == "Fault") {
                return;
            }
        }

        throw new Error();
    });

    it("Returns output as parsed quoted string containing separator", () => {
        assert.equal((new Str()).parse("\"foo bar\" after", { separator: " " }).output, "foo bar");
    });

    it("Returns output as parsed quoted string containing other quote string", () => {
        assert.equal((new Str()).parse("\"'\"", { separator: " " }).output, "'");
    });

    it("Returns output as parsed quoted string quoted with quote string more than 1 characters long", () => {
        assert.equal((new Str({ quotation: "quote" })).parse("quotefoo barquote", { separator: " " }).output, "foo bar");
    });

    it("Throws Fault if quoted string isn't immediately followed by a separator", () => {
        try {
            (new Str()).parse("\"foo bar\"apa bapa", { separator: " " });
        } catch (error) {
            if (error.name == "Fault") {
                return;
            }
        }

        throw new Error();
    });

});