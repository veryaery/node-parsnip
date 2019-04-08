import {
    Type,
    TypeReturnObject
} from "../interfaces/Type";
import { DefaultedOptions } from "../parse";

import * as methods from "../lib/methods";

export type ListOptions = {
    list_separator?: string[],
    mix?: number,
    max?: number
}

type DefaultedListOptions = {
    list_separator: string[],
    mix?: number,
    max?: number
}

export class ListType implements Type {

    static default_options: ListOptions = {
        list_separator: [ ",", "|" ]
    };

    type: Type;
    options: DefaultedListOptions;

    constructor(type: Type, options: ListOptions) {
        this.type = type;
        this.options = <DefaultedListOptions>methods.default_properties(options || {}, ListType.default_options);
    }

    async parse(input: string, options: DefaultedOptions): Promise<TypeReturnObject> {
        const result: TypeReturnObject = await this._parse_list(input, options);

        return result;
    }

    private async _parse_list(input: string, options: DefaultedOptions): Promise<TypeReturnObject> {
        const output: any[] = [];

        let remaining: string = input;
        
        while (remaining.length > 0) {
            let result: Promise<TypeReturnObject> | TypeReturnObject;

            try {
                result = this.type.parse(remaining, { ...options, separator: [ ...options.separator, ...this.options.list_separator ] });
            } catch (error) {
                throw error;
            }

            if (result instanceof Promise) {
                result = await result;
            }

            output.push(result.output);
            remaining = result.remaining;

            const starts_with: string = methods.starts_with(remaining, this.options.list_separator);

            if (starts_with) {
                remaining = methods.trim_start(remaining.slice(starts_with.length, remaining.length), options.separator);
            } else {
                break;
            }
        }

        return {
            output,
            remaining
        };
    }

}