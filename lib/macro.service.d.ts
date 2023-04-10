import { Block } from "./block";
import { Macro } from "./macro";
export declare class MacroService {
    macros: Macro[];
    registerMacro(text: string): boolean;
    parseMacro(block: Block, text: string): void;
}
export declare const macroService: MacroService;
