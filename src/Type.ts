import { Options } from "./index";

export type TypeParseReturnObject = {
    output: any,
    remaining: string
}

export abstract class Type {

    abstract parse(input: string, options: Options | object): TypeParseReturnObject | Promise<TypeParseReturnObject>;

}