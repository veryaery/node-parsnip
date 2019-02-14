import { Visitor } from "./interfaces/Visitor";
import { Options } from "./index";
import { Option } from "./interfaces/Option";
import { Command } from "./interfaces/Command";

import * as methods from "./lib/methods";

async function parse_command(visitor: Visitor, options: Options): Promise<Command> {
    const before = methods.before(visitor.remaining, options.separator);

    let match: Command | null;

    // Check if remaining input begins with the name of a command
    if (typeof visitor.command.commands == "object") {
        match = <Command | null>methods.match_object(before, visitor.command.commands);
    } else {
        match = <Command | null>methods.match_array(before, visitor.command.commands);
    }

    if (match) {
        visitor.remaining = methods.trim_start(visitor.remaining.slice(before.length, visitor.remaining.length), options.separator);
        visitor.command = match;
        return await parse_command(visitor, options);
    } else {
        return visitor.command;
    }
}