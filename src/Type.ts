export type TypeParseReturnObject = {
    output: any,
    remaining: string
}

export abstract class Type {

    abstract parse(input: string, options: object): TypeParseReturnObject | Promise<TypeParseReturnObject>;

}