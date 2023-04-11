export function extractKeyword(keyword: string, text: string): string[] {
  console.log("extractKeyword", keyword, text);
  const matches = new RegExp(`${keyword}=([^;\n]+)`).exec(text);
  if (!matches) return [];
  const values = extractKeywordValue(matches[1]);
  return values;
}

export function extractKeywordValue(keywordValue: string): string[] {
  const results = [] as string[];
  console.log("extractKeywordValue", keywordValue);
  const keywordValues = keywordValue.split(/[\n\s]+/);
  keywordValues.forEach((value) => {
    const matches = /([^(]+)\(([^)]*)\)/.exec(value);
    if (matches === null) throw new Error(`Invalid code: ${value}`);
    matches[2].split("|").forEach((v) => {
      results.push(`${matches[1]}(${v})`);
    });
  });
  return results;
}

export function getFilename(file: string) {
  const filename = file.toLowerCase().endsWith(".sbf") ? file : `${file}.sbf`;
  return filename;
}
