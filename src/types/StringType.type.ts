import { Type, TypeReturnObject } from "../interfaces/Type";
import { DefaultedOptions } from "../parse";
import { Fault } from "../classes/Fault";

import * as methods from "../lib/methods";

export type StringOptions = {
    quotation?: string[],
    escape?: string[],
    min?: number,
    max?: number
}

type DefaultedStringOptions = {
    quotation: string[],
    escape: string[],
    min?: number,
    max?: number
}

type ParseStringReturnObject = {
    output: string,
    excess_from: number,
    remaining: string
}

export class StringType implements Type {
    
    static default_options: StringOptions = {
        quotation: [ "\"", "'" ],
        escape: [ "\\" ]
    };

    options: DefaultedStringOptions;

    constructor(options?: StringOptions) {
        this.options = <DefaultedStringOptions>methods.default_properties(options || {}, StringType.default_options);
    }

    parse(input: string, options: DefaultedOptions): TypeReturnObject {
        const result: ParseStringReturnObject = this.parse_string(input, options);

        if (this.options.min && result.output.length < this.options.min) {
            throw new Fault({ min: this.options.min }, properties => `Must be a minimum of ${properties.min} characters long`, 0, input.length - result.remaining.length);
        } else if (this.options.max && result.output.length > this.options.max) {
            throw new Fault({ max: this.options.max }, properties => `Must be a maximum of ${properties.max} characters long`, result.excess_from, input.length - result.remaining.length);
        }

        return {
            output: result.output,
            remaining: result.remaining
        };
    }

    private parse_string(input: string, options: DefaultedOptions): ParseStringReturnObject {
        let remaining = input;
        let output: string = "";

        let escape: boolean = false;
        let quote: string = null;

        let last_remaining_length: number = remaining.length;
        let excess_from: number = null;

        while (remaining.length > 0) {
            if (this.options.max && !excess_from) {
                if (output.length > this.options.max) {
                    excess_from = input.length - last_remaining_length;
                } else {
                    last_remaining_length = remaining.length;
                }
            }

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
                    continue;
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

        if (this.options.max && !excess_from && output.length > this.options.max) {
            excess_from = input.length - last_remaining_length;
        }

        return {
            output,
            excess_from,
            remaining
        };
    }

}