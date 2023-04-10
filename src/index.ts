import { program } from "commander";
import glob from "glob";
import { processFile } from "./process-file";
import * as fs from "fs";

const clear = require("clear");
const figlet = require("figlet");

clear();
console.log(
  figlet.textSync("script BAF generator", { horizontalLayout: "full" })
);

program
  .version("0.0.1")
  .description("Generate script BAF files for IE games")
  .option("-f, --file <globs>", "Script file (can use wildcards)")
  .option("-i, --include <globs>", "Include script file (can use wildcards)")
  .parse(process.argv);

const options = program.opts();

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit();
}

async function main() {
  if (options.include) {
    const includes = await glob(options.include);
    includes.forEach(async (file) => {
      await processFile(file);
    });
  }
  const files = await glob(options.file);
  files.forEach(async (file) => {
    const output = await processFile(file);
    const outputFile = file.replace(".sbf", ".baf");
    fs.writeFileSync(outputFile, output);
  });
}

main();
