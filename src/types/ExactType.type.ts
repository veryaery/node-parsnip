import {
    Type,
    TypeReturnObject
} from "../interfaces/Type";
import { DefaultedOptions } from "../parse";
import { Fault } from "../classes/Fault";

export class ExactType<type> implements Type {

    type: Type;
    value: type;

    constructor(type: Type, value: type) {
        this.type = type;
        this.value = value;
    }

    async parse(input: string, options: DefaultedOptions): Promise<TypeReturnObject> {
        let result: Promise<TypeReturnObject> | TypeReturnObject;

        try {
            result = this.type.parse(input, options);
        } catch (error) {
            throw error;
        }

        if (result instanceof Promise) {
            result = await result;
        }

        if (result.output == this.value) {
            return result;
        } else {
            throw new Fault({ value: this.value }, properties => `Value isn't exactly ${properties.value}`, 0, input.length - result.remaining.length);
        }
    }

}