import { Visitor } from "./interfaces/Visitor";
import { DefaultedOptions } from "./interfaces/DefaultedOptions";
import { Option } from "./interfaces/Option";
import { Command } from "./interfaces/Command";
import { Argument } from "./interfaces/Argument";
import { TypeReturnObject } from "./Type";

import * as methods from "./lib/methods";

function argument_i(visitor): number {
    if (visitor.target == visitor.command) {
        return visitor.arguments.command.length;
    } else {
        return visitor.arguments.options[visitor.target.name].length;
    }
}

async function parse_argument(visitor: Visitor, options: DefaultedOptions): Promise<void> {
    const i: number = argument_i(visitor);
    const next: Argument = visitor.target.arguments[i];

    let result: TypeReturnObject | Promise<TypeReturnObject> = next.type.parse(visitor.remaining, options);

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
            await parse_option(visitor, options);

            // If the last target was the command
            if (was_command) {
                // Try to resume command argument parsing after parsing matched option
                visitor.target = visitor.command;
            } else {
                // Cancel option argument parsing
                break;
            }
        } else {
            // TODO: Check if both the target and command's parsing is done. If it is, throw an error. Too much input
        }

        await parse_argument(visitor, options);
    }

    // TODO: make sure all required arguments were parsed
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
        await parse_command(visitor, options);
    } else {
        await parse_option(visitor, options);
    }
}