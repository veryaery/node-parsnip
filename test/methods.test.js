const assert = require("assert");

const methods = require("../compiled/lib/methods.js");

describe("methods", () => {

    describe("starts_with", () => {

        it("Returns match string if it matched", () => {
            assert.equal(methods.starts_with("foobar", "foo"), "foo");
        });

        it("Returns null if didn't match", () => {
            assert.equal(methods.starts_with("barfoo", "foo"), null);
        });

        it("Returns matched string if it matched any from array", () => {
            assert.equal(methods.starts_with("apabapa", [
                "foo",
                "apa"
            ]), "apa");
        });

        it("Returns null if it didn't match any from array", () => {
            assert.equal(methods.starts_with("bapaapa", [
                "foo",
                "apa"
            ]), null);
        });

    });

    describe("trim_start", () => {

        it("Trims separator", () => {
            assert.equal(methods.trim_start(" trim", " "), "trim");
        });

        it("Trims multiple of separator", () => {
            assert.equal(methods.trim_start("   trim", " "), "trim");
        });

        it("Trims any separator from array", () => {
            assert.equal(methods.trim_start("bartrim", [
                "foo",
                "bar"
            ]), "trim");
        });

        it("Trims multiple separators from array", () => {
            assert.equal(methods.trim_start("foobartrim", [
                "foo",
                "bar"
            ]), "trim");
        });

        it("Trims multiple of multiple separators from array", () => {
            assert.equal(methods.trim_start("foofoobarfoobartrim", [
                "foo",
                "bar"
            ]), "trim");
        });

    });

    describe("before", () => {

        it("Returns entire string if it doesn't contain separator", () => {
            assert.equal(methods.before("entire", " "), "entire");
        });
        
        it("Returns string before separator", () => {
            assert.equal(methods.before("before after", " "), "before");
        });

        it("Returns string before any separator from array", () => {
            assert.equal(methods.before("beforebar", [ "foo", "bar" ]), "before");
        });

    });

});