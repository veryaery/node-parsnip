const assert = require("assert");

const parse = require("../compiled/parse.js");

describe("parse", async () => {

    it("Returns command", async () => {
        const command = {
            name: "root",
            arguments: [],
            commands: {},
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

        assert.equal(visitor.command, command);
    });

});