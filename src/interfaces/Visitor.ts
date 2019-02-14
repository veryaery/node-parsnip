import { Option } from "./Option";
import { Command } from "./Command";

export interface Visitor {
    input: string,
    remaining: string,
    command: Command 
}