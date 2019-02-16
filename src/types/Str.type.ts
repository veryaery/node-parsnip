import { Type, TypeParseReturnObject } from "../Type";
import { DefaultedOptions } from "../interfaces/DefaultedOptions";

import * as methods from "../lib/methods";

export type StrOptions = {
    quotation_marks?: string[]
}

interface DefaultedStrOptions {
    quotation_marks: string[]
}

export class Str extends Type {
    
    static default_options: StrOptions = {
        quotation_marks: [ "\"", "'" ]
    }

    options: DefaultedStrOptions

    constructor(options?: StrOptions) {
        super();

        this.options = <DefaultedStrOptions>methods.default_properties(options, Str.default_options);
    }

    parse(input: string, options: DefaultedOptions): TypeParseReturnObject {
        return {} as TypeParseReturnObject;
    }

}