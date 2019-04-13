import {
    Type,
    TypeReturnObject
} from "../interfaces/Type";
import { DefaultedOptions } from "../parse";
import { Fault } from "../classes/Fault";

import * as methods from "../lib/methods";

export type ListOptions = {
    list_separator?: string[],
    min?: number,
    max?: number
}

type DefaultedListOptions = {
    list_separator: string[],
    min?: number,
    max?: number
}

type ParseListReturnObject = {
    output: any[],
    excess_from: number,
    remaining: string
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
        let result: ParseListReturnObject;

        try {
            result = await this._parse_list(input, options);
        } catch (error) {
            throw error;
        }

        if (this.options.min && result.output.length < this.options.min) {
            throw new Fault({ min: this.options.min }, properties => `Must contain a minimum of ${properties.min} items`, 0, input.length - result.remaining.length);
        } else if (this.options.max && result.output.length > this.options.max) {
            throw new Fault({ max: this.options.max }, properties => `Must contain a maximum of ${properties.max} items`, result.excess_from, input.length - result.remaining.length);
        }

        return result;
    }

    private async _parse_list(input: string, options: DefaultedOptions): Promise<ParseListReturnObject> {
        const output: any[] = [];

        let remaining: string = input;
        let last_remaining_length: number = remaining.length;
        let excess_from: number = null;
        
        while (remaining.length > 0) {
            let result: Promise<TypeReturnObject> | TypeReturnObject;

            if (this.options.max && !excess_from) {
                if (output.length > this.options.max) {
                    excess_from = input.length - last_remaining_length;
                } else {
                    last_remaining_length = remaining.length;
                }
            }

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