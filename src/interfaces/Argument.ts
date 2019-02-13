import { Type } from "../Type";

export interface Argument {
    name?: string,
    optional?: boolean,
    type: Type
}