"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const glob_1 = __importDefault(require("glob"));
const process_file_1 = require("./process-file");
const fs = __importStar(require("fs"));
const clear = require("clear");
const figlet = require("figlet");
clear();
console.log(figlet.textSync("script BAF generator", { horizontalLayout: "full" }));
commander_1.program
    .version("0.0.1")
    .description("Generate script BAF files for IE games")
    .option("-f, --file <globs>", "Script file (can use wildcards)")
    .option("-i, --include <globs>", "Include script file (can use wildcards)")
    .parse(process.argv);
const options = commander_1.program.opts();
if (!process.argv.slice(2).length) {
    commander_1.program.outputHelp();
    process.exit();
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (options.include) {
            const includes = yield (0, glob_1.default)(options.include);
            includes.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                yield (0, process_file_1.processFile)(file);
            }));
        }
        const files = yield (0, glob_1.default)(options.file);
        files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            const output = yield (0, process_file_1.processFile)(file);
            const outputFile = file.replace(".sbf", ".baf");
            fs.writeFileSync(outputFile, output);
        }));
    });
}
main();
