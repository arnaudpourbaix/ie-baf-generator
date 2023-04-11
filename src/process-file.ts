import glob from "glob";
import * as fs from "fs";
import { blockService } from "./block.service";
import { macroService } from "./macro.service";
import { getFilename } from "./extract";

export function processFile(filename: string): Promise<string> {
  const content = fs.readFileSync(filename, { encoding: "utf8", flag: "r" });
  let chain: Promise<any> = Promise.resolve();
  const payload = {
    output: [] as string[],
    block: "",
  };
  content.split("\n").forEach((line) => {
    chain = chain.then(() => processLine(payload, line));
  });
  return chain.then(() => payload.output.join(""));
}

export function processLine(
  payload: { output: string[]; block: string },
  line: string
): Promise<any> {
  //   console.log("processFile", line);
  const blockStart = /^\s*\{/.test(line);
  const blockEnd = /^(?<!\/\/)[^}]*\}\s*$/.test(line);
  if (blockStart || payload.block.length) {
    // payload.block += line.slice(0, -1);
    payload.block += line.replace(/[\r\n]/g, " ");
  }
  if (blockEnd && payload.block.length) {
    const b = payload.block;
    payload.block = "";
    return processBlock(b).then((r) => payload.output.push(...r));
  } else if (!payload.block.length) {
    payload.output.push(line);
  }
  return Promise.resolve();
}

export function processBlock(text: string): Promise<string[]> {
  //   console.log("processBlock START", text);
  const results = [] as string[];
  const hasRegisterMacro = macroService.registerMacro(text);
  const isInclude = /include=[^}]+/.test(text);
  let chain: Promise<any> = Promise.resolve();
  if (isInclude) {
    chain = chain
      .then(() => includeFiles(text))
      .then((r) => results.push(...r));
  } else if (!hasRegisterMacro) {
    const block = blockService.create(text);
    results.push(...blockService.generate(block));
  }
  return chain.then(() => {
    // console.log("processBlock END", text);
    return results;
  });
}

export function includeFiles(text: string): Promise<string[]> {
  const matches = /include=([^}]+)/.exec(text);
  if (matches === null) throw new Error(`Invalid include: ${text}`);
  const filename = getFilename(matches[1]);
  return glob(filename).then((files) => {
    let chain: Promise<any> = Promise.resolve();
    const output = [] as string[];
    files.forEach((file) => {
      chain = chain
        .then(() => processFile(file))
        .then((r) => output.push(...r));
    });
    return chain.then(() => output);
  });
}
