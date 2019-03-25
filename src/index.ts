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

export async function parse(input: string, command: Command, options?: Options): Promise<ParseReturnObject> {
    const visitor: Visitor = {
        input,
        remaining: input,
        command,
        target: command,
        prefix: "",
        arguments: [],
        options: {}
    };
    const defaulted_options: DefaultedOptions = <DefaultedOptions>methods.default_properties(options || {}, default_options);

    try {
        await parse_command(visitor, defaulted_options);
    } catch (error) {
        throw error;
    }

    return {
        command: visitor.command,
        arguments: visitor.arguments,
        options: visitor.options
    };
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