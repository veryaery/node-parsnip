import { Type, TypeReturnObject } from "../Type";
import { DefaultedOptions } from "../interfaces/DefaultedOptions";

import * as methods from "../lib/methods";

export type NumberOptions = {
    base?: (string[])[],
    decimal?: string | string[],
    negative?: string | string[],
    ignore?: string | string[]
}

interface DefaultedNumberOptions {
    base: (string[])[],
    decimal: string | string[],
    negative: string | string[],
    ignore: string | string[]
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

}