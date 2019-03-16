const assert = require("assert");

const { IntegerType } = require("../compiled/index.js").types;

describe("IntegerType", () => {

    it("Throws Fault if number isn't an integer", () => {
        try {
            (new IntegerType()).parse("3.141592", { separator: [ " " ] });
        } catch (error) {
            if (error.name == "Fault") {
                return;
            }
        }

        throw new Error();
    });

});