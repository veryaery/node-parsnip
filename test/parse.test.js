const assert = require("assert");

const parsnip = require("../compiled/index.js");
const parse = require("../compiled/parse.js");

describe("parse", async () => {

    describe("parse_command", () => {

        it("Returns command", async () => {
            const command = parsnip.command("root").build();
            const visitor = {
                input: "",
                remaining: "",
                command: command,
                target: command,
                arguments: {
                    command: [],
                    options: {}
                }
            };
    
            await parse.parse_command(visitor, { separator: " " });
    
            assert.deepEqual(visitor.command, command);
        });

        it("Parses command", async () => {
            const child_command = parsnip.command("child").build();
            const command = parsnip.command("root")
                .add_command("", child_command)
                .build();
            const visitor = {
                input: "child",
                remaining: "child",
                command: command,
                target: command,
                arguments: {
                    command: [],
                    options: {}
                }
            };
    
            await parse.parse_command(visitor, { separator: " " });
    
            assert.deepEqual(visitor.command, child_command);
        });

    });

    describe("parse_option", () => {

        it("Parses option", async () => {
            const option = parsnip.option("option")
                .build();
            const command = parsnip.command("root")
                .add_option("--", option)
                .build();
            const visitor = {
                input: "--option",
                remaining: "--option",
                command: command,
                target: command,
                arguments: {
                    command: [],
                    options: {}
                }
            };

            await parse.parse_option(visitor, { separator: " " });

            assert.deepEqual(visitor.arguments.options.option, []);
        });

    });

});