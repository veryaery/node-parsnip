import { Option } from "./interfaces/Option";
import { Command } from "./interfaces/Command";
import { Argument } from "./interfaces/Argument";
import { TypeReturnObject } from "./Type";
import { Fault } from "./Fault";

import * as methods from "./lib/methods";

export type DefaultedOptions = {
    separator: string | string[]
}

export type Visitor = {
    input: string,
    remaining: string,
    command: Command,
    target: Option,
    arguments: {
        command: any[],
        options: object
    }
}

function next_argument_i(visitor: Visitor): number {
    if (visitor.target == visitor.command) {
        return visitor.arguments.command.length;
    } else {
        return visitor.arguments.options[visitor.target.name].length;
    }
}

function shortest(input: string[]) {
    let output: string = input[0];

    for (let i = 1; i < input.length; i++) {
        const current_input = input[i];

        if (current_input.length > output.length) {
            output = current_input;
        }
    }

    return output;
}

async function parse_argument(visitor: Visitor, options: DefaultedOptions): Promise<void> {
    const i: number = next_argument_i(visitor);
    const next: Argument = visitor.target.arguments[i];

    let result: TypeReturnObject | Promise<TypeReturnObject>;

    try {
        result = next.type.parse(visitor.remaining, options);
    } catch (error) {
        if (error instanceof Fault) {
            const from: number = visitor.input.length - visitor.remaining.length;

            // Add margin from start of input to argument's fault's from and to 
            error.from = error.from ? error.from + from : from;
            error.to = error.to ? error.to + from : visitor.input.length;
        }

        throw error;
    }

    if (result instanceof Promise) {
        result = await result;
    }

    visitor.remaining = result.remaining;

    if (visitor.target == visitor.command) {
        visitor.arguments.command[i] = result.output;
    } else {
        visitor.arguments.options[visitor.target.name][i] = result.output;
    }
}

async function parse_option(visitor: Visitor, options: DefaultedOptions): Promise<void> {
    while (visitor.remaining.length > 0) {
        const before = methods.before(visitor.remaining, options.separator);

        let match: Option;

        // Match input before next separator with an option
        if (typeof visitor.command.options == "object") {
            match = methods.match_object(before, visitor.command.options);
        } else {
            match = methods.match_array(before, visitor.command.options);
        }

        if (match) {
            const was_command: boolean = visitor.target == visitor.command;

            // If there was a match, parse that option instead
            visitor.remaining = methods.trim_start(visitor.remaining.slice(before.length, visitor.remaining.length), options.separator);
            visitor.target = match;

            try {
                await parse_option(visitor, options);
            } catch (error) {
                throw error;
            }

            // If the last target was the command
            if (was_command) {
                // Try to resume command argument parsing after parsing matched option
                visitor.target = visitor.command;
            } else {
                // Cancel option argument parsing
                break;
            }
        } else {
            // See if both the target's and command's argument parsing is done. If so, throw an error. Too much input
            const fault: Fault = new Fault(null, () => "Excess input", visitor.input.length - visitor.remaining.length, visitor.input.length);
            
            if (visitor.target == visitor.command) {
                if (visitor.arguments.command.length == visitor.command.arguments.length) {
                    throw fault;
                }
            } else {
                if (
                    visitor.arguments.options[visitor.target.name].length == visitor.target.arguments.length &&
                    visitor.arguments.command.length == visitor.command.arguments.length
                ) {
                    throw fault;
                }
            }

            try {
                await parse_argument(visitor, options);
            } catch (error) {
                throw error;
            }
        }
    }

    // Make sure all required arguments were parsed
    const i: number = next_argument_i(visitor);

    if (i < visitor.target.arguments.length) {
        const next: Argument = visitor.target.arguments[i];

        if (!next.optional) {
            const shortest_separator_length: number = typeof options.separator == "string" ? options.separator.length : shortest(<string[]>options.separator).length;
            const from: number = visitor.input.length + shortest_separator_length;
            throw new Fault({ argument: next }, properties => `Argument ${properties.argument.name} is required`, from, from + 1);
        }
    }
}

async function parse_command(visitor: Visitor, options: DefaultedOptions): Promise<void> {
    const before = methods.before(visitor.remaining, options.separator);

    let match: Command;

    // Match input before next separator with a command 
    if (typeof visitor.command.commands == "object") {
        match = <Command>methods.match_object(before, visitor.command.commands);
    } else {
        match = <Command>methods.match_array(before, visitor.command.commands);
    }

    if (match) {
        // If there was a match, parse the matched command
        visitor.remaining = methods.trim_start(visitor.remaining.slice(before.length, visitor.remaining.length), options.separator);
        visitor.command = match;
        visitor.target = match;

        try {
            await parse_command(visitor, options);
        } catch (error) {
            throw error;
        }
    } else {
        try {
            await parse_option(visitor, options);
        } catch (error) {
            throw error;
        }
    }
}