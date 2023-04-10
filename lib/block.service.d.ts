import { Block } from "./block";
export declare class BlockService {
    create(text: string): Block;
    mergeBlock(block: Block, block2: Block): void;
    parseBlock(block: Block, text: string): void;
    addTriggers(block: Block, values: string[]): void;
    addActions(block: Block, values: string[]): void;
    addGlobal(block: Block, values: string[], area: string): void;
    generate(block: Block): string[];
}
export declare const blockService: BlockService;
