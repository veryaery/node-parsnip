const assert = require("assert");

const parsnip = require("../compiled/index.js");
const parse = require("../compiled/parse.js");
const methods = require("../compiled/lib/methods.js");

class Type {

    parse(input, options) {
        const before = methods.before(input, options.separator);

        return {
            output: before,
            remaining: input.slice(before.length, input.length)
        };
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
    
            await parse.parse_command(visitor, { separator: [ " " ] });
    
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
    
            await parse.parse_command(visitor, { separator: [ " " ] });
    
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

            await parse.parse_option(visitor, { separator: [ " " ] });

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

            await parse.parse_option(visitor, { separator: [ " " ] });

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
                await parse.parse_option(visitor, { separator: [ " " ] });
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
                remaining: "--option",
                command: command,
                target: option,
                arguments: [],
                options: {
                    option: []
                }
            };

            try {
                await parse.parse_option(visitor, { separator: [ " " ] });
            } catch (error) {
                if (error.name == "Fault") {
                    return;
                }
            }

            throw new Error();
        });

        it("Cancels option argument parsing", async () => {
            const canceled = parsnip.option("canceled")
                .add_argument(parsnip.argument(new Type())
                    .set_optional(true)
                    .build()
                )
                .build();
            const canceling = parsnip.option("canceling")
                .add_argument(parsnip.argument(new Type()).build())
                .build();
            const command = parsnip.command("root")
                .add_option("--", canceled)
                .add_option("--", canceling)
                .build();
            const visitor = {
                input: "--canceled --canceling argument",
                remaining: "--canceling argument",
                command: command,
                target: canceled,
                arguments: [],
                options: {
                    canceled: [],
                    canceling: []
                } 
            };

            await parse.parse_option(visitor, { separator: [ " " ]});

            assert.deepEqual(visitor.options.canceled, []);
        });

        it("Continues command argument parsing", async () => {
            const option = parsnip.option("option").build();
            const command = parsnip.command("root")
                .add_argument(parsnip.argument(new Type()).build())
                .add_option("--", option)
                .build();
            const visitor = {
                input: "--option argument",
                remaining: "--option argument",
                command: command,
                target: command,
                arguments: [],
                options: {
                    option: []
                }
            };

            await parse.parse_option(visitor, { separator: [ " " ]});

            assert.deepEqual(visitor.arguments, [ "argument" ]);
        });

        it("Continues parsing though optional command argument wasn't supplied", async () => {
            const command = parsnip.command("root")
                .add_argument(parsnip.argument(new Type()).build())
                .add_argument(parsnip.argument(new Type())
                    .set_optional(true)
                    .build()
                )
                .build();
            const visitor = {
                input: "argument",
                remaining: "argument",
                command: command,
                target: command,
                arguments: [],
                options: {}
            };

            await parse.parse_option(visitor, { separator: [ " " ]});
        });

        it("Continues parsing though optional option argument wasn't supplied", async () => {
            const option = parsnip.option("option")
                .add_argument(parsnip.argument(new Type()).build())
                .add_argument(parsnip.argument(new Type())
                    .set_optional(true)
                    .build()
                )
                .build();
            const command = parsnip.command("root")
                .add_option("--", option)
                .build();
            const visitor = {
                input: "--option argument",
                remaining: "--option argument",
                command: command,
                target: option,
                arguments: [],
                options: {}
            };

            await parse.parse_option(visitor, { separator: [ " " ]});
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

            await parse.parse_argument(visitor, { separator: [ " " ] });

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
            const options = { separator: [ " " ] };

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

            await parse.parse_argument(visitor, { separator: [ " " ] });

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
            const options = { separator: [ " " ] };
 
            await parse.parse_argument(visitor, options);
            await parse.parse_argument(visitor, options);

            assert.deepEqual(visitor.options.option, [ "foo", "bar" ]);
        });

    });

});