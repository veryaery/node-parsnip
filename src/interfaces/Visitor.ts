import { Option } from "./Option";
import { Command } from "./Command";

export interface Visitor {
    input: string,
    remaining: string,
    command: Command,
    target: Option,
    arguments: {
        command: any[],
        options: object
    }
}