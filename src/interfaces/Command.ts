import { Option } from "./Option";

export interface Command extends Option {
    commands: object | Command[],
    options: object | Option[]
}