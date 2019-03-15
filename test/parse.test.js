const assert = require("assert");

const parsnip = require("../compiled/index.js");
const parse = require("../compiled/parse.js");

class Type {

    parse(input, options) {
        let remaining = input;
        let output = "";

        while (remaining.length > 0) {
            if (typeof options.separator == "string") {
                if (remaining.startsWith(options.separator)) {
                    break;
                }
            } else {
                for (const separator of options.separator) {
                    if (remaining.startsWith(separator)) {
                        break;
                    }
                }
            }

            output += remaining.slice(0, 1);
            remaining = remaining.slice(1, remaining.length);
        }

        return {
            output,
            remaining
        }
    }

}

describe("parse", async () => {

    describe("parse_command", () => {

        it("Returns command", async () => {
            const command = parsnip.command("root").build();
            const visitor = {
                input: "",
                remaining: "",
                command: command,
                target: command,
                arguments: [],
                options: {}
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
                arguments: [],
                options: {}
            };
    
            await parse.parse_command(visitor, { separator: " " });
    
            assert.deepEqual(visitor.command, child_command);
        });

        it("Parses command by alias", async () => {
            const child_command = parsnip.command("child")
                .add_alias("offspring")
                .build();
            const command = parsnip.command("root")
                .add_command("", child_command)
                .build();
            const visitor = {
                input: "offspring",
                remaining: "offspring",
                command: command,
                target: command,
                arguments: [],
                options: {}
            };
    
            await parse.parse_command(visitor, { separator: " " });
    
            assert.deepEqual(visitor.command, child_command);
        });

    });

    describe("parse_option", () => {

        it("Parses option", async () => {
            const option = parsnip.option("option").build();
            const command = parsnip.command("root")
                .add_option("--", option)
                .build();
            const visitor = {
                input: "--option",
                remaining: "--option",
                command: command,
                target: command,
                arguments: [],
                options: {}
            };

            await parse.parse_option(visitor, { separator: " " });

            assert.deepEqual(visitor.options.option, []);
        });

        it("Parses option by alias", async () => {
            const option = parsnip.option("option")
                .add_alias("choice")
                .build();
            const command = parsnip.command("root")
                .add_option("--", option)
                .build();
            const visitor = {
                input: "--choice",
                remaining: "--choice",
                command: command,
                target: command,
                arguments: [],
                options: {}
            };

            await parse.parse_option(visitor, { separator: " " });

            assert.deepEqual(visitor.options.option, []);
        });

        it("Breaks parsing once both command's and target's parsing is done", async () => {
            const option = parsnip.option("option")
                .add_argument(parsnip.argument(new Type()).build())
                .build();
            const command = parsnip.command("root")
                .add_option("--", option)
                .add_argument(parsnip.argument(new Type()).build())
                .build();
            const visitor = {
                input: "foo --option bar excess",
                remaining: "excess",
                command: command,
                target: option,
                arguments: [ "foo" ],
                options: {
                    option: [ "bar" ]
                }
            };

            await parse.parse_option(visitor, { separator: " " });

            assert.equal(visitor.remaining, "excess");
        });

        it("Throws Fault if all required command arguments weren't supplied", async () => {
            const command = parsnip.command("root")
                .add_argument(parsnip.argument(new Type()).build())
                .build();
            const visitor = {
                input: "",
                remaining: "",
                command: command,
                target: command,
                arguments: [],
                options: {}
            };

            try {
                await parse.parse_option(visitor, { separator: " " });
            } catch (error) {
                if (error.name == "Fault") {
                    return;
                }
            }

            throw new Error();
        });

        it("Throws Fault if all required option arguments weren't supplied", async () => {
            const option = parsnip.option("option")
                .add_argument(parsnip.argument(new Type()).build())
                .build();
            const command = parsnip.command("root")
                .add_option("--", option)
                .build();
            const visitor = {
                input: "--option",
                remaining: "",
                command: command,
                target: option,
                arguments: [],
                options: {
                    option: []
                }
            };

            try {
                await parse.parse_option(visitor, { separator: " " });
            } catch (error) {
                if (error.name == "Fault") {
                    return;
                }
            }

            throw new Error();
        });

    });

    describe("parse_argument", () => {

        it("Parses command argument", async () => {
            const command = parsnip.command("root")
                .add_argument(parsnip.argument(new Type()))
                .build();
            const visitor = {
                input: "argument",
                remaining: "argument",
                command: command,
                target: command,
                arguments: [],
                options: {}
            };

            await parse.parse_argument(visitor, { separator: " " });

            assert.deepEqual(visitor.arguments, [ "argument" ]);
        });

        it("Parses multiple command arguments", async () => {
            const command = parsnip.command("root")
                .add_argument(parsnip.argument(new Type()).build())
                .add_argument(parsnip.argument(new Type()).build())
                .build();
            const visitor = {
                input: "foo bar",
                remaining: "foo bar",
                command: command,
                target: command,
                arguments: [],
                options: {}
            };
            const options = { separator: " " };

            await parse.parse_argument(visitor, options);
            await parse.parse_argument(visitor, options);

            assert.deepEqual(visitor.arguments, [ "foo", "bar" ]);
        });

        it("Parses option argument", async () => {
            const option = parsnip.option("option")
                .add_argument(parsnip.argument(new Type()).build())
                .build();
            const command = parsnip.command("root")
                .add_option("--", option)
                .build();
            const visitor = {
                input: "--option argument",
                remaining: "argument",
                command: command,
                target: option,
                arguments: [],
                options: {
                    option: []
                }
            };

            await parse.parse_argument(visitor, { separator: " " });

            assert.deepEqual(visitor.options.option, [ "argument" ]);
        });

        it("Parses multiple option arguments", async () => {
            const option = parsnip.option("option")
                .add_argument(parsnip.argument(new Type()).build())
                .add_argument(parsnip.argument(new Type()).build())
                .build();
            const command = parsnip.command("root")
                .add_option("--", option)
                .build();
            const visitor = {
                input: "--option foo bar",
                remaining: "foo bar",
                command: command,
                target: option,
                arguments: [],
                options: {
                    option: []
                }
            };
            const options = { separator: " " };
 
            await parse.parse_argument(visitor, options);
            await parse.parse_argument(visitor, options);

            assert.deepEqual(visitor.options.option, [ "foo", "bar" ]);
        });

    });

});