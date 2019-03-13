import { Option, Argument } from "../parse";

export class OptionBuilder {

    name: string;
    arguments: Argument[] = [];

    constructor(name: string) {
        this.name = name;
    }

    set_name(name: string): OptionBuilder {
        this.name = name;
        return this;
    }

    set_arguments(_arguments: Argument[]): OptionBuilder {
        this.arguments = _arguments;
        return this;
    }

    add_argument(argument: Argument): OptionBuilder {
        this.arguments.push(argument);
        return this;
    }

    build(): Option {
        return {
            name: this.name,
            arguments: []
        };
    }

}