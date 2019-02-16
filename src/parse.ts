import { Visitor } from "./interfaces/Visitor";
import { DefaultedOptions } from "./interfaces/DefaultedOptions";
import { Option } from "./interfaces/Option";
import { Command } from "./interfaces/Command";

import * as methods from "./lib/methods";
import { Argument } from "./interfaces/Argument";

function argument_i(visitor): number {
    if (visitor.target == visitor.command) {
        return visitor.arguments.command.length;
    } else {
        return visitor.arguments.options[visitor.target.name].length;
    }
}

async function parse_option(visitor: Visitor, options: DefaultedOptions): Promise<void> {
    while (visitor.remaining.length > 0) {
        const before = methods.before(visitor.remaining, options.separator);

        let match: Option | null;

        // Match input before next separator with an option
        if (typeof visitor.command.options == "object") {
            match = <Option | null>methods.match_object(before, visitor.command.options);
        } else {
            match = <Option | null>methods.match_array(before, visitor.command.options);
        }

        if (match) {
            // If there was a match, parse that option instead
            visitor.remaining = methods.trim_start(visitor.remaining.slice(before.length, visitor.remaining.length), options.separator);
            visitor.target = match;
            await parse_option(visitor, options);

            if (visitor.target != visitor.command) {
                // We should only try to resume argument parsing after matching another option if the target is the command
                break;
            }
        } else {
            // TODO: Check if both the target and command's parsing is done. If it is, throw an error. Too much input
        }

        // Parse target's arguments
        const i: number = argument_i(visitor);
        const next: Argument = visitor.target.arguments[i];


    }

    // TODO: make sure all required arguments were parsed
}

async function parse_command(visitor: Visitor, options: DefaultedOptions): Promise<void> {
    const before = methods.before(visitor.remaining, options.separator);

    let match: Command | null;

    // Match input before next separator with a command 
    if (typeof visitor.command.commands == "object") {
        match = <Command | null>methods.match_object(before, visitor.command.commands);
    } else {
        match = <Command | null>methods.match_array(before, visitor.command.commands);
    }

    if (match) {
        // If there was a match, parse the matched command
        visitor.remaining = methods.trim_start(visitor.remaining.slice(before.length, visitor.remaining.length), options.separator);
        visitor.command = match;
        visitor.target = match;
        await parse_command(visitor, options);
    }
}