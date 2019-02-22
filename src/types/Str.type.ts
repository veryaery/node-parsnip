import { Type, TypeReturnObject } from "../Type";
import { DefaultedOptions } from "../interfaces/DefaultedOptions";

import * as methods from "../lib/methods";

export type StrOptions = {
    quotation?: string | string[],
    escape?: string | string[]
}

interface DefaultedStrOptions {
    quotation: string | string[],
    escape: string | string[]
}

export class Str extends Type {
    
    static default_options: StrOptions = {
        quotation: [ "\"", "'" ],
        escape: "\\"
    }

    options: DefaultedStrOptions

    constructor(options?: StrOptions) {
        super();

        this.options = <DefaultedStrOptions>methods.default_properties(options, Str.default_options);
    }

    parse(input: string, options: DefaultedOptions): TypeReturnObject {
        let output: string = "";
        let escape: boolean = false;
        let quote: string = null;

        while (input.length > 0) {
            if (escape) {
                const starts_with: string =
                    methods.starts_with(input, this.options.escape) ||
                    methods.starts_with(input, this.options.quotation);
    
                if (starts_with) {
                    output += starts_with;
                    input = input.slice(starts_with.length, input.length);
                } else {
                    output += input[0];
                    input = input.slice(1, input.length);
                }
                
                escape = false;
                continue;
            }

            const starts_with_separator: string = methods.starts_with(input, options.separator);

            if (starts_with_separator) {
                if (quote) {
                    output += starts_with_separator;
                    input = input.slice(starts_with_separator.length, input.length);
                } else {
                    break;
                }
            }

            const starts_with_escape: string = methods.starts_with(input, this.options.escape);

            if (starts_with_escape) {
                escape = true;
                input = input.slice(starts_with_escape.length, input.length);

                if (input.length == 0) {
                    // TODO: Throw an error. Attempting to escape null
                }

                continue;
            }

            const starts_with_quote: string = methods.starts_with(input, this.options.quotation);

            if (starts_with_quote) {
                input = input.slice(starts_with_quote.length, input.length);
                
                if (quote) {
                    if (quote == starts_with_quote) {
                        const starts_with_separator: string = methods.starts_with(input, options.separator);

                        if (starts_with_separator || input.length == 0) {
                            break;
                        } else {
                            // TODO: Throw an error. Expected separator at end of string
                        }
                    } else {
                        output += starts_with_quote;
                    }
                } else {
                    quote = starts_with_quote;
                }

                continue;
            }

            output += input[0];
            input = input.slice(1, input.length);
        }

        return {
            output,
            remaining: input
        };
    }

}