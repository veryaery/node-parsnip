import {
    Type,
    TypeReturnObject
} from "../interfaces/Type";
import { DefaultedOptions } from "../parse";
import { Fault } from "./Fault";

import * as methods from "../lib/methods";

export type NumberOptions = {
    base?: (string[])[],
    decimal?: string[],
    negative?: string[],
    ignore?: string[],
    min?: number,
    max?: number
}

export type DefaultedNumberOptions = {
    base: (string[])[],
    decimal: string[],
    negative: string[],
    ignore: string[],
    min?: number,
    max?: number
}

export type ParseInputReturnObject = {
    indexes: (number[])[],
    decimal: boolean,
    decimal_from: number,
    negative: boolean,
    remaining: string
}

export abstract class NumberType<options extends NumberOptions, defaulted_options extends DefaultedNumberOptions> implements Type {

    static default_options: NumberOptions = {
        base: [
            [ "0" ], [ "1" ], [ "2" ],
            [ "3" ], [ "4" ], [ "5" ],
            [ "6" ], [ "7" ], [ "8" ],
            [ "9" ]
        ],
        decimal: [ ".", "," ],
        negative: [ "-" ],
        ignore: [ "'" ]
    };

    options: defaulted_options;

    constructor(options?: options, default_options?: options) {
        this.options = <defaulted_options>methods.default_properties(options || {}, default_options || {});
    }

    abstract parse(input: string, options: DefaultedOptions): TypeReturnObject;

    protected parse_input(input: string, options: DefaultedOptions): ParseInputReturnObject {
        let remaining: string = input;
        let decimal: boolean = false;
        let negative: boolean = false;
        let decimal_from: number = null;

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
                decimal_from = input.length - remaining.length;
                remaining = remaining.slice(starts_with_decimal.length, remaining.length);
                continue;
            }

            const starts_with_ignore: string = methods.starts_with(remaining, this.options.ignore);

            if (starts_with_ignore) {
                remaining = remaining.slice(starts_with_ignore.length, remaining.length);
                continue;
            }

            let continue_while: boolean = false; // ._.

            for (let i = 0; i < this.options.base.length; i++) {
                const digits: string[] = this.options.base[i];

                for (let digit_i = 0; digit_i < digits.length; digit_i++) {
                    const digit: string = digits[digit_i];

                    if (remaining.startsWith(digit)) {
                        if (decimal) {
                            indexes[1].push(i);
                        } else {
                            indexes[0].push(i);
                        }

                        remaining = remaining.slice(digit.length, remaining.length);
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

            const from: number = input.length - remaining.length;
            throw new Fault(null, () => "Expected separator at end on number", from, from + 1);
        }

        if (!indexes[0].length && !indexes[0].length) {
            const to: number = input.length - remaining.length;
            throw new Fault(null, () => "Number is null", 0, to);
        }

        return {
            indexes,
            decimal,
            decimal_from,
            negative,
            remaining
        };
    }

    protected parse_number(indexes: (number[])[], negative: boolean): number {
        let output: number = 0;
        let decimal: boolean = false;

        for (const digits of indexes) {
            if (decimal) {
                for (let i: number = 0; i < digits.length; i++) {
                    const digit: number = digits[i];
                    const factor: number = (this.options.base.length ** (i + 1));
                    output = Math.round((output + digit * ((this.options.base.length ** -(i + 1)) || 1)) * factor) / factor;
                }
            } else {
                const reversed_digits: number[] = digits.reverse();
    
                for (let i: number = 0; i < digits.length; i++) {
                    const digit: number = reversed_digits[i];
                    output += digit * ((this.options.base.length ** i) || 1);
                }
            }
            
            decimal = true;
        }

        return negative ? -output : output;
    }
    
    protected validate(output: number, input: string, remaining: string): void {
        if (this.options.min && output < this.options.min) {
            throw new Fault({ min: this.options.min }, properties => `Must be a minimum of ${properties.min}`, 0, input.length - remaining.length);
        } else if (this.options.max && output > this.options.max) {
            throw new Fault({ max: this.options.max }, properties => `Must be a maximum of ${properties.max}`, 0, input.length - remaining.length);
        }
    }

}