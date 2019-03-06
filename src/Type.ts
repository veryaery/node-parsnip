import { DefaultedOptions } from "./parse";

export type TypeReturnObject = {
    output: any,
    remaining: string
}

export abstract class Type {

    abstract parse(input: string, options: DefaultedOptions): TypeReturnObject | Promise<TypeReturnObject>

}