import * as types from "./types";

import { ArgumentBuilder } from "./classes/ArgumentBuilder";
import { OptionBuilder } from "./classes/OptionBuilder";
import { CommandBuilder } from "./classes/CommandBuilder";

import { Type } from "./interfaces/Type";

export type Options = {
    separator?: string | string[]
}

const default_options: Options = {
    separator: [ " " ]
};

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