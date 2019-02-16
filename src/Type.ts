import { DefaultedOptions } from "./interfaces/DefaultedOptions";

export type TypeParseReturnObject = {
    output: any,
    remaining: string
}

export abstract class Type {

    abstract parse(input: string, options: DefaultedOptions): TypeParseReturnObject | Promise<TypeParseReturnObject>;

}