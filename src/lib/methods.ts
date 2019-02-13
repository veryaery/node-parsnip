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