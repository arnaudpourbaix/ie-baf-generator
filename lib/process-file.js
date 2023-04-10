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
exports.includeFiles = exports.processText = exports.processFile = void 0;
const glob_1 = __importDefault(require("glob"));
const fs = __importStar(require("fs"));
const block_service_1 = require("./block.service");
const macro_service_1 = require("./macro.service");
const extract_1 = require("./extract");
function processFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = fs.readFileSync(filename, { encoding: "utf8", flag: "r" });
        const output = [];
        //   let nothing = false;
        //   let rx = /([^{]+)?(\/?\/?\s*\{([^}]+)\}\r\n)?/gim;
        //   let matches: RegExpExecArray | null;
        //   while (!nothing && (matches = rx.exec(content))) {
        //     nothing = !matches[1] && !matches[2];
        //     if (matches[1]) output.push(matches[1]);
        //     if (matches[2]) {
        //       //  && !/\/\/\s*\}/.test(matches[2])
        //       console.log(matches[2]);
        //       const text = matches[3].trim();
        //       const generated = processText(text);
        //       output.push(...(await generated));
        //     }
        //   }
        let block = "";
        content.split("\n").forEach((line) => __awaiter(this, void 0, void 0, function* () {
            const blockStart = /^\s*\{/.test(line);
            const blockEnd = /^(?<!\/\/)\s*\}\s*$/.test(line);
            // console.log(blockStart, blockEnd, line);
            // console.log(block);
            if (blockStart) {
                block = line;
                //   console.log("new block:", line);
            }
            else if (block.length) {
                block += line;
                //   console.log("concat block: ", line);
            }
            if (blockEnd && block.length) {
                console.log("reset block:", block);
                //   output.push(...(await processText(block)));
                block = "";
            }
            else if (!block.length) {
                output.push(line);
            }
        }));
        return output.join("");
    });
}
exports.processFile = processFile;
function processText(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        const hasRegisterMacro = macro_service_1.macroService.registerMacro(text);
        const isInclude = text.startsWith("include=");
        if (isInclude) {
            results.push(...(yield includeFiles(text)));
        }
        else if (!hasRegisterMacro) {
            const block = block_service_1.blockService.create(text);
            results.push(...block_service_1.blockService.generate(block));
        }
        return results;
    });
}
exports.processText = processText;
function includeFiles(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const matches = /include=(.+)/.exec(text);
        if (matches === null)
            throw new Error(`Invalid include: ${text}`);
        const files = yield (0, glob_1.default)((0, extract_1.getFilename)(matches[1]));
        files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            console.log("includeFile", file);
            yield processFile(file);
        }));
        return [];
    });
}
exports.includeFiles = includeFiles;
