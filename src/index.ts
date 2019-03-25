import * as methods from "./lib/methods";
import * as types from "./types";

import {
    Argument,
    Option,
    Command,
    Visitor,
    DefaultedOptions,
    parse_command,
} from "./parse";

import { ArgumentBuilder } from "./classes/ArgumentBuilder";
import { OptionBuilder } from "./classes/OptionBuilder";
import { CommandBuilder } from "./classes/CommandBuilder";

import { Type } from "./interfaces/Type";

export type Options = {
    separator?: string | string[]
}

export type ParseReturnObject = {
    command: Command,
    arguments: {},
    options: {}
}

const default_options: Options = {
    separator: [ " " ]
};

function argument_object(target: Option, values: any[]): {} {
    const output: {} = {};

    for (let i: number = 0; i < values.length; i++) {
        const value: any = values[i];
        const argument: Argument = target.arguments[i];

        output[i] = value;

        if (argument.name) {
            output[argument.name] = value;
        }
    }
    
    return output;
}

export async function parse(input: string, command: Command, options?: Options): Promise<ParseReturnObject> {
    const visitor: Visitor = {
        input,
        remaining: input,
        command,
        target: command,
        arguments: [],
        options: {}
    };
    const defaulted_options: DefaultedOptions = <DefaultedOptions>methods.default_properties(options || {}, default_options);

    try {
        await parse_command(visitor, defaulted_options);
    } catch (error) {
        throw error;
    }

    const output: ParseReturnObject = {
        command: visitor.command,
        arguments: argument_object(visitor.command, visitor.arguments),
        options: {}
    };

    for (const option_name in visitor.options) {
        const option: Options = vis
        const option_arguments: Argument[] = visitor.options[option_name];
        output.options[option_name] = argument_object(option_arguments);
    }

    return output;
}

export function argument(type: Type): ArgumentBuilder {
    return new ArgumentBuilder(type);
}

export function option(name: string): OptionBuilder {
    return new OptionBuilder(name);    
}

export function command(name: string): CommandBuilder {
    return new CommandBuilder(name);
}

export {
    types,
    ArgumentBuilder,
    OptionBuilder,
    CommandBuilder
};