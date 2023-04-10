import { Block } from "./block";
import { extractKeyword } from "./extract";
import { macroService } from "./macro.service";

export class BlockService {
  create(text: string) {
    const block: Block = {
      rawText: text,
      triggers: [],
      actions: [],
      targets: [],
    };
    this.parseBlock(block, text);
    return block;
  }

  mergeBlock(block: Block, block2: Block) {
    block.actions.push(...block2.actions);
    block.targets.push(...block2.targets);
    block.triggers.push(...block2.triggers);
  }

  parseBlock(block: Block, text: string) {
    this.addTriggers(block, extractKeyword("trigger", text));
    this.addActions(block, extractKeyword("action", text));
    this.addGlobal(block, extractKeyword("global", text), "GLOBAL");
    this.addGlobal(block, extractKeyword("local", text), "LOCALS");
  }

  addTriggers(block: Block, values: string[]) {
    values.forEach((v) => {
      if (v.startsWith("$")) macroService.parseMacro(block, v);
      else block.triggers.push({ name: v });
    });
  }

  addActions(block: Block, values: string[]) {
    values.forEach((v) => {
      if (v.startsWith("$")) macroService.parseMacro(block, v);
      else block.actions.push({ name: v });
    });
  }

  addGlobal(block: Block, values: string[], area: string) {
    values.map((value) => {
      const matches = /([^(]+)\(([^,)]+)\,([^)]+)\)/.exec(value);
      if (matches === null) throw new Error(`Invalid global: ${value}`);
      block.triggers.push({
        name: `Global("${matches[1]}","${area}",${matches[2]})`,
      });
      block.actions.push({
        name: `SetGlobal("${matches[1]}","${area}",${matches[3]})`,
      });
    });
  }

  generate(block: Block): string[] {
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

export const blockService = new BlockService();
