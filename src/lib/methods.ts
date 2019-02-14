import { Option } from "../interfaces/Option";

export function trim_start(input: string, separator: string): string {
    while (input.length > 0) {
        if (input.startsWith(separator)) {
            input = input.slice(separator.length, input.length);
        } else {
            break;
        }
    }

    return input;
}

export function before(input: string, separator: string): string {
    let before: string = "";

    while (input.length > 0) {
        if (input.startsWith(separator)) {
            break;
        } else {
            before += input.slice(0, 1);
            input = input.slice(1, input.length);
        }
    }

    return before;
}

export function match_array(input: string, array: Option[]): Option | null {
    for (const option of array) {
        if (option.name == input) {
            return option;
        }
    }

    return null;
}

export function match_object(input: string, object: object): Option | null {
    for (const prefix in object) {
        const options: Option[] = object[prefix];

        if (input.startsWith(prefix)) {
            const trimmed_input: string = input.slice(prefix.length, input.length);

            for (const option of options) {
                if (option.name == trimmed_input) {
                    return option;
                }
            }
        }
    }

    return null;
}