import { Option } from "../parse";

export function starts_with(input: string, matches: string[]): string {
    for (const match of matches) {
        if (input.startsWith(match)) {
            return match;
        }
    }

    return null;
}

export function trim_start(input: string, separators: string[]): string {
    while (input.length > 0) {
        const starts_with_separator: string = starts_with(input, separators);

        if (starts_with_separator) {
            input = input.slice(starts_with_separator.length, input.length);
        } else {
            break;
        }
    }

    return input;
}

export function before(input: string, separators: string[]): string {
    let before: string = "";

    while (input.length > 0) {
        const starts_with_separator: string = starts_with(input, separators);

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
        if (input == option.name) {
            return option;
        } else if (option.aliases) {
            // Try to match Option's aliases if it has any
            for (const alias of option.aliases) {
                if (input == alias) {
                    return option;
                }
            }
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
                if (trimmed_input == option.name) {
                    return option;
                } else if (option.aliases) {
                    // Try to match Option's aliases if it has any
                    for (const alias of option.aliases) {
                        if (trimmed_input == alias) {
                            return option;
                        }
                    }
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