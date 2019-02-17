import { Type, TypeReturnObject } from "../Type";
import { DefaultedOptions } from "../interfaces/DefaultedOptions";

import * as methods from "../lib/methods";

export type StrOptions = {
    quotation_marks?: string[],
    escape?: string[]
}

interface DefaultedStrOptions {
    quotation_marks: string[],
    escape: string[]
}

export class Str extends Type {
    
    static default_options: StrOptions = {
        quotation_marks: [ "\"", "'" ],
        escape: [ "\\" ]
    }

    options: DefaultedStrOptions

    constructor(options?: StrOptions) {
        super();

        this.options = <DefaultedStrOptions>methods.default_properties(options, Str.default_options);
    }

    parse(input: string, options: DefaultedOptions): TypeReturnObject {
        let output: string = "";
        let escape: boolean = false;
        let quote: string | null = null;

        while (input.length > 0) {
            if (escape) {
                const starts_with: string | null =
                    this.starts_with_of_array(input, this.options.escape) ||
                    this.starts_with_of_array(input, this.options.quotation_marks);
    
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

            if (input.startsWith(options.separator)) {
                if (quote) {
                    output += options.separator;
                    input = input.slice(options.separator.length, input.length);
                } else {
                    break;
                }
            }

            const starts_with_escape: string | null = this.starts_with_of_array(input, this.options.escape);

            if (starts_with_escape) {
                escape = true;
                input = input.slice(starts_with_escape.length, input.length);

                if (input.length == 0) {
                    // TODO: Throw an error. Attempting to escape null
                }

                continue;
            }

            const starts_with_quote: string | null = this.starts_with_of_array(input, this.options.quotation_marks);

            if (starts_with_quote) {
                input = input.slice(starts_with_quote.length, input.length);
                
                if (quote) {
                    if (quote == starts_with_quote) {
                        if (input.startsWith(options.separator)) {
                            break;
                        } else {
                            // TODO: Throw an error. Expected separator
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

    private starts_with_of_array(input: string, matches: string[]): string | null {
        for (const match of matches) {
            if (input.startsWith(match)) {
                return match;
            }
        }

        return null;
    }

}