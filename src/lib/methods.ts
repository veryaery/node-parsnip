import { Option } from "../interfaces/Option";

export function starts_with(input: string, matches: string | string[]): string {
    if (typeof matches == "string") {
        if (input.startsWith(matches)) {
            return matches;
        }
    } else {
        for (const match of matches) {
            if (input.startsWith(match)) {
                return match;
            }
        }
    }

    return null;
}

export function trim_start(input: string, separator: string | string[]): string {
    while (input.length > 0) {
        const starts_with_separator: string = starts_with(input, separator);

        if (starts_with_separator) {
            input = input.slice(starts_with_separator.length, input.length);
        } else {
            break;
        }
    }

    return input;
}

export function before(input: string, separator: string | string[]): string {
    let before: string = "";

    while (input.length > 0) {
        const starts_with_separator: string = starts_with(input, separator);

        if (starts_with_separator) {
            break;
        } else {
            before += input.slice(0, 1);
            input = input.slice(1, input.length);
        }
    }

    return before;
}

export function match_array(input: string, matches: Option[]): Option {
    for (const option of matches) {
        if (option.name == input) {
            return option;
        }
    }

    return null;
}

export function match_object(input: string, matches: object): Option {
    for (const prefix in matches) {
        const options: Option[] = matches[prefix];

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

export function default_properties(object: object, default_object: object): object {
    for (const key in default_object) {
        if (!object.hasOwnProperty(key)) {
            object[key] = default_object[key];
        }
    }

    return object;
}