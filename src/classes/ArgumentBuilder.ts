import { Type } from "../interfaces/Type";
import { Argument } from "../parse";

export class ArgumentBuilder {

    type: Type;
    name: string;
    optional: boolean = false;

    constructor(type: Type) {
        this.type = type;
    }

    set_type(type: Type): ArgumentBuilder {
        this.type = type;
        return this;
    }

    set_name(name: string): ArgumentBuilder {
        this.name = name;
        return this;
    }

    set_optional(optional: boolean): ArgumentBuilder {
        this.optional = optional;
        return this;
    }

    build(): Argument {
        return {
            type: this.type,
            name: this.name,
            optional: this.optional
        };
    }

}