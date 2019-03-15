import { OptionBuilder } from "./OptionBuilder";
import { Command, Option } from "../parse";

export class CommandBuilder extends OptionBuilder {

    commands: object | Command[] = [];
    options: object | Option[] = [];

    set_commands(commands: object | Command[]): CommandBuilder {
        this.commands = commands;
        return this;
    }

    add_command(prefix: string, command: Command): CommandBuilder {
        if (this.commands instanceof Array) {
            if (prefix == "") {
                this.commands.push(command);
            } else {
                this.commands = {};
                this.commands[prefix] = [ command ];
            }
        } else {
            let prefix_commands: Command[] = this.commands[prefix];
            
            if (!prefix_commands) {
                prefix_commands = this.commands[prefix] = [];
            }

            prefix_commands.push(command);
        }
        return this;
    }

    set_options(options: object | Option[]): CommandBuilder {
        this.options = options;
        return this;
    }

    add_option(prefix: string, option: Option): CommandBuilder {
        if (this.options instanceof Array) {
            if (prefix == "") {
                this.options.push(option);
            } else {
                this.options = {};
                this.options[prefix] = [ option ];
            }
        } else {
            let prefix_options: Option[] = this.options[prefix];
            
            if (!prefix_options) {
                prefix_options = this.options[prefix] = [];
            }

            prefix_options.push(option);
        }
        return this;
    }

    build(): Command {
        return {
            name: this.name,
            aliases: this.aliases,
            arguments: this.arguments,
            commands: this.commands,
            options: this.options
        };
    }

}