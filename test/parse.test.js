const assert = require("assert");

const parse = require("../compiled/parse.js");

describe("parse", async () => {

    describe("parse_command", () => {

        it("Returns command", async () => {
            const command = {
                name: "root",
                arguments: [],
                commands: [],
                options: {}
            };
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
            const child_command = {
                name: "child",
                arguments: [],
                commands: [],
                options: {}
            };
            const command = {
                name: "root",
                arguments: [],
                commands: [
                    child_command
                ],
                options: {}
            };
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

});