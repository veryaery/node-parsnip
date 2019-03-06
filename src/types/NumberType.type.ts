import { Type, TypeReturnObject } from "../Type";
import { DefaultedOptions } from "../parse";

import * as methods from "../lib/methods";

export type NumberOptions = {
    base?: (string[])[],
    decimal?: string | string[],
    negative?: string | string[],
    ignore?: string | string[]
}

type DefaultedNumberOptions = {
    base: (string[])[],
    decimal: string | string[],
    negative: string | string[],
    ignore: string | string[]
}

type ParseInputReturnObject = {
    indexes: (number[])[],
    negative: boolean,
    remaining: string
}

export class NumberType extends Type {

    static default_options: NumberOptions = {
        base: [
            [ "0" ], [ "1" ], [ "2" ],
            [ "3" ], [ "4" ], [ "5" ],
            [ "6" ], [ "7" ], [ "8" ],
            [ "9" ]
        ],
        decimal: [ ".", "," ],
        negative: "-",
        ignore: "'"
    };

    options: DefaultedNumberOptions;

    constructor(options?: NumberOptions) {
        super();

        this.options = <DefaultedNumberOptions>methods.default_properties(options || {}, NumberType.default_options);
    }

    parse(input: string, options: DefaultedOptions): TypeReturnObject {
        return null;
    }

    private parse_input(input: string, options: DefaultedOptions): ParseInputReturnObject {
        let remaining: string = input;
        let decimal: boolean = false;
        let negative: boolean = false;

        const indexes: (number[])[] = [[], []];
        const starts_with_negative: string = methods.starts_with(remaining, this.options.negative);

        if (starts_with_negative) {
            negative = true;
            remaining = remaining.slice(starts_with_negative.length, remaining.length);
        }

        while (remaining.length > 0) {
            const starts_with_separator: string = methods.starts_with(remaining, options.separator);

            if (starts_with_separator) {
                break;
            }

            const starts_with_decimal: string = methods.starts_with(remaining, this.options.decimal);

            if (starts_with_decimal) {
                decimal = true;
                remaining = remaining.slice(starts_with_decimal.length, remaining.length);
                continue;
            }

            const starts_with_ignore: string = methods.starts_with(remaining, this.options.ignore);

            if (starts_with_ignore) {
                remaining = remaining.slice(starts_with_decimal.length, remaining.length);
                continue;
            }

            let continue_while: boolean = false; // ._.

            for (let i = 0; i < this.options.base.length; i++) {
                const symbols: string[] = this.options.base[i];

                for (let symbol_i = 0; symbols.length; symbol_i++) {
                    const symbol: string = symbols[symbol_i];

                    if (remaining.startsWith(symbol)) {
                        if (decimal) {
                            indexes[1].push(i);
                        } else {
                            indexes[0].push(i);
                        }

                        remaining = remaining.slice(symbol.length, remaining.length);
                        continue_while = true;
                        break;
                    }
                }

                if (continue_while) {
                    break;
                }
            }

            if (continue_while) {
                continue;
            }

            // TODO: throw fault. expected separator at end of number
        }

        // TODO: throw fault if indexes is empty. number is null

        return {
            indexes,
            negative,
            remaining
        };
    }

}