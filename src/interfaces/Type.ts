import { DefaultedOptions } from "../parse";

export type TypeReturnObject = {
    output: any,
    remaining: string
}

export interface Type {

    parse(input: string, options: DefaultedOptions): TypeReturnObject | Promise<TypeReturnObject>

}