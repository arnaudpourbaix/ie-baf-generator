"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.macroService = exports.MacroService = void 0;
const block_service_1 = require("./block.service");
class MacroService {
    constructor() {
        this.macros = [];
    }
    registerMacro(text) {
        const matches = /\$\w+\=(\w+)/.exec(text);
        if (!matches)
            return false;
        this.macros.push({
            name: matches[1],
            block: block_service_1.blockService.create(text),
        });
        return true;
    }
    parseMacro(block, text) {
        const matches = /([^(]+)\(([^)]*)\)/.exec(text);
        if (matches === null)
            throw new Error(`Invalid macro: ${text}`);
        const name = matches[1].slice(1);
        const macro = this.macros.find((m) => m.name === name);
        if (!macro)
            throw new Error(`Macro ${name} has not been defined`);
        block_service_1.blockService.mergeBlock(block, macro.block);
    }
}
exports.MacroService = MacroService;
exports.macroService = new MacroService();
