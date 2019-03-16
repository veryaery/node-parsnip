const assert = require("assert");

const methods = require("../compiled/lib/methods.js");
const parsnip = require("../compiled/index.js");

describe("methods", () => {

    describe("starts_with", () => {

        it("Returns matched string", () => {
            assert.equal(methods.starts_with("barfoo", [
                "foo",
                "bar"
            ]), "bar");
        });

        it("Returns null if it couldn't match", () => {
            assert.equal(methods.starts_with("apabapa", [
                "foo",
                "bar"
            ]), null);
        });

    });

    describe("trim_start", () => {

        it("Trims separator", () => {
            assert.equal(methods.trim_start("bartrim", [
                "foo",
                "bar"
            ]), "trim");
        });

        it("Trims multiple separators", () => {
            assert.equal(methods.trim_start("foobartrim", [
                "foo",
                "bar"
            ]), "trim");
        });

        it("Trims multiple of multiple separators", () => {
            assert.equal(methods.trim_start("foofoobarfoobartrim", [
                "foo",
                "bar"
            ]), "trim");
        });

    });

    describe("before", () => {

        it("Returns string before any separator", () => {
            assert.equal(methods.before("beforebar", [ "foo", "bar" ]), "before");
        });

        it("Returns entire string if it doesn't contain separator", () => {
            assert.equal(methods.before("entire string", [ "foo", "bar" ]), "entire string");
        });

    });

    describe("match_array", () => {
        
        it("Returns matched Option", () => {
            const match = parsnip.option("bar").build();

            assert.equal(methods.match_array("bar", [
                parsnip.option("foo").build(),
                match
            ]), match);
        });

        it("Returns matched Option by alias", () => {
            const match = parsnip.option("apa")
                .add_alias("bapa")
                .build();

            assert.equal(methods.match_array("bapa", [
                parsnip.option("foo")
                    .add_alias("bar")
                    .build(),
                match
            ]), match);
        });

        it("Returns null if it couldn't match", () => {
            assert.equal(methods.match_array("apa", [
                parsnip.option("foo").build(),
                parsnip.option("bar").build()
            ]), null);
        });

    });
    
    describe("match_object", () => {

        it("Returns matched Option", () => {
            const match = parsnip.option("bapa").build();

            assert.equal(methods.match_object("barbapa", {
                "foo": [ parsnip.option("apa").build() ],
                "bar": [ match ]
            }), match);
        });

        it("Returns matched Option by alias", () => {
            const match = parsnip.option("b")
                .add_alias("c")
                .build();

            assert.equal(methods.match_object("ac", {
                "x": [
                    parsnip.option("y")
                        .add_alias("z")
                        .build() 
                ],
                "a": [ match ]
            }), match);
        });

        it("Returns null if it couldn't matcht", () => {
            assert.equal(methods.match_object("null", {
                "foo": [ parsnip.option("apa").build() ],
                "bar": [ parsnip.option("bapa").build() ]
            }), null);
        });

    });

    describe("default_properties", () => {

        it("Ignores existing properties", () => {
            const original = {
                foo: "a",
                apa: "b"
            };

            assert.deepEqual(methods.default_properties(original, {
                foo: "bar",
                apa: "bapa"
            }), original);
        });

        it("Defaults non-existing properties", () => {
            const defaults = {
                foo: "bar",
                apa: "bapa"
            };

            assert.deepEqual(methods.default_properties({ foo: "bar" }, defaults), defaults);
        });

    });

});