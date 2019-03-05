import { Visitor } from "./interfaces/Visitor";

export type MessageTemplate = (properties: any) => string

export class Fault extends Error {

    name: string = "Fault";
    visitor: Visitor;
    properties: any;
    default_template: MessageTemplate;
    from: number;
    to: number;

    constructor(properties: any, default_template: MessageTemplate, from?: number, to?: number) {
        super(default_template(properties));

        this.properties = properties;
        this.default_template = default_template;
        this.from = from;
        this.to = to;
    }

    to_string(template?: MessageTemplate): string {
        return (template || this.default_template)(this.properties);
    }

}