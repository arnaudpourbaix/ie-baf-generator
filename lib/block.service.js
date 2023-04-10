"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockService = exports.BlockService = void 0;
const extract_1 = require("./extract");
const macro_service_1 = require("./macro.service");
class BlockService {
    create(text) {
        const block = {
            rawText: text,
            triggers: [],
            actions: [],
            targets: [],
        };
        this.parseBlock(block, text);
        return block;
    }
    mergeBlock(block, block2) {
        block.actions.push(...block2.actions);
        block.targets.push(...block2.targets);
        block.triggers.push(...block2.triggers);
    }
    parseBlock(block, text) {
        this.addTriggers(block, (0, extract_1.extractKeyword)("trigger", text));
        this.addActions(block, (0, extract_1.extractKeyword)("action", text));
        this.addGlobal(block, (0, extract_1.extractKeyword)("global", text), "GLOBAL");
        this.addGlobal(block, (0, extract_1.extractKeyword)("local", text), "LOCALS");
    }
    addTriggers(block, values) {
        values.forEach((v) => {
            if (v.startsWith("$"))
                macro_service_1.macroService.parseMacro(block, v);
            else
                block.triggers.push({ name: v });
        });
    }
    addActions(block, values) {
        values.forEach((v) => {
            if (v.startsWith("$"))
                macro_service_1.macroService.parseMacro(block, v);
            else
                block.actions.push({ name: v });
        });
    }
    addGlobal(block, values, area) {
        values.map((value) => {
            const matches = /([^(]+)\(([^,)]+)\,([^)]+)\)/.exec(value);
            if (matches === null)
                throw new Error(`Invalid global: ${value}`);
            block.triggers.push({
                name: `Global("${matches[1]}","${area}",${matches[2]})`,
            });
            block.actions.push({
                name: `SetGlobal("${matches[1]}","${area}",${matches[3]})`,
            });
        });
    }
    generate(block) {
        if (!block.actions.length || !block.triggers.length)
            throw new Error(`invalid block: ${block.rawText}`);
        const lines = ["IF\n"];
        block.triggers.forEach((r) => lines.push(`\t${r.name}\n`));
        lines.push("THEN\n");
        lines.push("\tRESPONSE #100\n");
        block.actions.forEach((r) => lines.push(`\t\t${r.name}\n`));
        lines.push("END\n");
        return lines;
    }
}
exports.BlockService = BlockService;
exports.blockService = new BlockService();
