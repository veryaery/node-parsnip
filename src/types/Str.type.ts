import { Type, TypeParseReturnObject } from "../Type";
import { DefaultedOptions } from "../interfaces/DefaultedOptions";

export class Str extends Type {

    parse(input: string, options: DefaultedOptions): TypeParseReturnObject {
        return {} as TypeParseReturnObject;
    }

}