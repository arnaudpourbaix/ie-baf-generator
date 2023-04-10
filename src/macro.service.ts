import { Block } from "./block";
import { blockService } from "./block.service";
import { Macro } from "./macro";

export class MacroService {
  macros: Macro[] = [];

  registerMacro(text: string): boolean {
    const matches = /\$\w+\=(\w+)/.exec(text);
    if (!matches) return false;
    this.macros.push({
      name: matches[1],
      block: blockService.create(text),
    });
    console.log("registerMacro", matches[1]);
    return true;
  }

  parseMacro(block: Block, text: string) {
    const matches = /([^(]+)\(([^)]*)\)/.exec(text);
    if (matches === null) throw new Error(`Invalid macro: ${text}`);
    const name = matches[1].slice(1);
    const macro = this.macros.find((m) => m.name === name);
    if (!macro) throw new Error(`Macro ${name} has not been defined`);
    blockService.mergeBlock(block, macro.block);
  }
}

export const macroService = new MacroService();
