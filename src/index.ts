import * as methods from "./lib/methods";

export type Options = {
    separator?: string | string[]
}

const default_options: Options = {
    separator: " "
};

export { methods };
export { StringType } from "./types/StringType.type";