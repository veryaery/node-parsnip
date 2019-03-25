const methods = require("../compiled/lib/methods.js");

exports.Type = class Type {

    parse(input, options) {
        const before = methods.before(input, options.separator);

        return {
            output: before,
            remaining: input.slice(before.length, input.length)
        };
    }

}