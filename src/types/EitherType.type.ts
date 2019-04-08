import {
    Type,
    TypeReturnObject
} from "../interfaces/Type";
import { DefaultedOptions } from "../parse";
import { Fault } from "../classes/Fault";

export class EitherType implements Type {

    types: Type[];

    constructor(types: Type[]) {
        this.types = types;
    }

    parse(input: string, options: DefaultedOptions): Promise<TypeReturnObject> | TypeReturnObject {
        for (const type of this.types) {
            try {
                return type.parse(input, options);
            } catch (error) {}
        }

        throw new Fault(null, () => "Invalid value", 0, input.length);
    }

} 