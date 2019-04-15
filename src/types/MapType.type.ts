import {
    Type,
    TypeReturnObject
} from "../interfaces/Type";
import { DefaultedOptions } from "../parse";

import * as methods from "../lib/methods";

export type MapOptions = {
    key_separator?: string[],
    value_separator?: string[],
    keys?: [] | {}
}

type DefaultedMapOptions = {
    key_separator: string[],
    value_separator: string[],
    keys?: [] | {}
}

export class MapType implements Type {

    static default_options: MapOptions = {
        key_separator: [ ":", "=" ],
        value_separator: [ ",", "|" ]
    };

    type: Type;
    options: DefaultedMapOptions;

    constructor(type: Type, options: MapOptions) {
        this.type = type;
        this.options = <DefaultedMapOptions>methods.default_properties(options || {}, MapType.default_options);
    }

    parse(input: string, options: DefaultedOptions): TypeReturnObject {
        return null;
    }

}