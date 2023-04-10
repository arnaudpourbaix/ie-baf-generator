"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilename = exports.extractKeywordValue = exports.extractKeyword = void 0;
function extractKeyword(keyword, text) {
    const matches = new RegExp(`${keyword}=([^;\n]+)`).exec(text);
    if (!matches)
        return [];
    const values = extractKeywordValue(matches[1]);
    return values;
}
exports.extractKeyword = extractKeyword;
function extractKeywordValue(keywordValue) {
    const results = [];
    const keywordValues = keywordValue.split("&");
    keywordValues.forEach((value) => {
        const matches = /([^(]+)\(([^)]*)\)/.exec(value);
        if (matches === null)
            throw new Error(`Invalid code: ${value}`);
        matches[2].split("|").forEach((v) => {
            results.push(`${matches[1]}(${v})`);
        });
    });
    return results;
}
exports.extractKeywordValue = extractKeywordValue;
function getFilename(file) {
    const filename = file.toLowerCase().endsWith(".sbf") ? file : `${file}.sbf`;
    return filename;
}
exports.getFilename = getFilename;
