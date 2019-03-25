const assert = require("assert");

const parsnip = require("../compiled/index.js");

const { Type } = require("./Type.js");

describe.only("index", () => {

    describe("parse", () => {
       
        it("Returns parsed command", async () => {
            const command = parsnip.command("root").build();
            const result = await parsnip.parse("", command, { separator: [ " " ]});
            assert.equal(result.command, command);
        });

        it("Returns parsed arguments by index", async () => {
            const command = parsnip.command("root")
                .add_argument(parsnip.argument(new Type()).build())
                .build();
            const result = await parsnip.parse("argument", command, { separator: [ " " ]});
            assert.equal(result.arguments[0], "argument");
        });

        it("Returns parsed arguments by name", async () => {
            const command = parsnip.command("root")
                .add_argument(parsnip.argument(new Type())
                    .set_name("argument")
                    .build()
                )
                .build();
            const result = await parsnip.parse("argument", command, { separator: [ " " ]});
            assert.equal(result.arguments["argument"], "argument");
        });

    });

});