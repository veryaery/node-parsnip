import { Type, TypeReturnObject } from "../Type";
import { DefaultedOptions } from "../parse";
import { Fault } from "../Fault";

import * as methods from "../lib/methods";

export type StringOptions = {
    quotation?: string | string[],
    escape?: string | string[]
}

type DefaultedStringOptions = {
    quotation: string | string[],
    escape: string | string[]
}

export class StringType extends Type {
    
    static default_options: StringOptions = {
        quotation: [ "\"", "'" ],
        escape: "\\"
    };

    options: DefaultedStringOptions;

    constructor(options?: StringOptions) {
        super();

        this.options = <DefaultedStringOptions>methods.default_properties(options || {}, StringType.default_options);
    }

    parse(input: string, options: DefaultedOptions): TypeReturnObject {
        let remaining = input;
        let output: string = "";
        let escape: boolean = false;
        let quote: string = null;

        while (remaining.length > 0) {
            if (escape) {
                const starts_with: string =
                    methods.starts_with(remaining, this.options.escape) ||
                    methods.starts_with(remaining, this.options.quotation);
    
                if (starts_with) {
                    output += starts_with;
                    remaining = remaining.slice(starts_with.length, remaining.length);
                } else {
                    output += remaining[0];
                    remaining = remaining.slice(1, remaining.length);
                }
                
                escape = false;
                continue;
            }

            const starts_with_separator: string = methods.starts_with(remaining, options.separator);

            if (starts_with_separator) {
                if (quote) {
                    output += starts_with_separator;
                    remaining = remaining.slice(starts_with_separator.length, remaining.length);
                } else {
                    break;
                }
            }

            const starts_with_escape: string = methods.starts_with(remaining, this.options.escape);

            if (starts_with_escape) {
                escape = true;
                remaining = remaining.slice(starts_with_escape.length, remaining.length);

                if (remaining.length == 0) {
                    throw new Fault(null, () => "Attempting to escape null", input.length - starts_with_escape.length, input.length);
                }

                continue;
            }

            const starts_with_quote: string = methods.starts_with(remaining, this.options.quotation);

            if (starts_with_quote) {
                remaining = remaining.slice(starts_with_quote.length, remaining.length);
                
                if (quote) {
                    if (quote == starts_with_quote) {
                        const starts_with_separator: string = methods.starts_with(remaining, options.separator);

                        if (starts_with_separator || remaining.length == 0) {
                            break;
                        } else {
                            const from: number = input.length - remaining.length;
                            throw new Fault(null, () => "Expected separator at end of string", from, from + 1);
                        }
                    } else {
                        output += starts_with_quote;
                    }
                } else {
                    quote = starts_with_quote;
                }

                continue;
            }

            output += remaining[0];
            remaining = remaining.slice(1, remaining.length);
        }

        return {
            output,
            remaining
        };
    }

}