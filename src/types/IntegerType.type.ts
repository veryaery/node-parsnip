import {
    NumberType,
    NumberOptions,
    DefaultedNumberOptions,
    ParseInputReturnObject
} from "../classes/NumberType";
import { TypeReturnObject } from "../interfaces/Type";
import { DefaultedOptions } from "../parse";
import { Fault } from "../classes/Fault";

export class IntegerType extends NumberType<NumberOptions, DefaultedNumberOptions> {

    static default_options: NumberOptions = {
        base: [
            [ "0" ], [ "1" ], [ "2" ],
            [ "3" ], [ "4" ], [ "5" ],
            [ "6" ], [ "7" ], [ "8" ],
            [ "9" ]
        ],
        decimal: [ ".", "," ],
        negative: "-",
        ignore: "'"
    };

    constructor(options?: NumberOptions) {
        super(options, IntegerType.default_options);
    }

    parse(input: string, options: DefaultedOptions): TypeReturnObject {
        const parse_input_result: ParseInputReturnObject = this.parse_input(input, options);

        if (parse_input_result.decimal) {
            throw new Fault(null, () => "Number must be an integer", parse_input_result.decimal_from, input.length - parse_input_result.remaining.length);   
        }

        const output: number = this.parse_number(parse_input_result.indexes, parse_input_result.negative);

        this.validate(output, input, parse_input_result.remaining);

        return {
            output,
            remaining: parse_input_result.remaining
        };
    }

}