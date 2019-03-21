import {
    Type,
    TypeReturnObject
} from "../interfaces/Type";
import { DefaultedOptions } from "../parse";
import { Fault } from "../classes/Fault";

import * as methods from "../lib/methods";

export type BooleanOptions = {
    true?: string[],
    false?: string[]
}

type DefaultedBooleanOptions = {
    true: string[]
    false: string[]
}

export class BooleanType implements Type {

    static default_options: BooleanOptions = {
        true: [ "true", "yes", "Y" ],
        false: [ "false", "no", "n" ]
    };

    options: DefaultedBooleanOptions;

    constructor(options: BooleanOptions) {
        this.options = <DefaultedBooleanOptions>methods.default_properties(options || {}, BooleanType.default_options);
    }

    parse(input: string, options: DefaultedOptions): TypeReturnObject {
        const starts_with_true: string = methods.starts_with(input, this.options.true);

        if (starts_with_true) {
            return {
                output: true,
                remaining: input.slice(starts_with_true.length, input.length)
            };
        }

        const starts_with_false: string = methods.starts_with(input, this.options.false);

        if (starts_with_false) {
            return {
                output: false,
                remaining: input.slice(starts_with_false.length, input.length)
            };
        }

        throw new Fault(null, () => "Invalid value", 0, methods.before(input, options.separator).length);
    }

}