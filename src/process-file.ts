import glob from "glob";
import * as fs from "fs";
import { blockService } from "./block.service";
import { macroService } from "./macro.service";
import { getFilename } from "./extract";

export async function processFile(filename: string): Promise<string> {
  const content = fs.readFileSync(filename, { encoding: "utf8", flag: "r" });
  const output = [] as string[];
  let block = "";
  content.split("\n").forEach(async (line) => {
    console.log("processFile", line);
    const blockStart = /^\s*\{/.test(line);
    const blockEnd = /^(?<!\/\/)[^}]*\}\s*$/.test(line);
    if (blockStart || block.length) {
      block += line.slice(0, -1);
    }
    if (blockEnd && block.length) {
      const b = block;
      block = "";
      output.push(...(await processText(b)));
    } else if (!block.length) output.push(line);
  });
  return Promise.resolve(output.join(""));
}

export async function processText(text: string): Promise<string[]> {
  console.log("processText START", text);
  const results = [];
  const hasRegisterMacro = macroService.registerMacro(text);
  const isInclude = /include=[^}]+/.test(text);
  if (isInclude) {
    await includeFiles(text);
    //results.push(...(await includeFiles(text)));
  } else if (!hasRegisterMacro) {
    const block = blockService.create(text);
    results.push(...blockService.generate(block));
  }
  console.log("processText END", text);
  return Promise.resolve(results);
}

export async function includeFiles(text: string): Promise<string[]> {
  const matches = /include=([^}]+)/.exec(text);
  if (matches === null) throw new Error(`Invalid include: ${text}`);
  const filename = getFilename(matches[1]);
  const files = await glob(filename);
  const output = [] as string[];
  files.forEach(async (file) => {
    //output.push(...(await processFile(file)));
    // await processFile(file);
  });
  return Promise.resolve(output);
}
