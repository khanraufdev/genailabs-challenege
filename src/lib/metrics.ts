export type Metrics = {
  length: { chars: number; words: number; tokens?: number };
  repetition: { ratio: number; maxRun: number };
  structure: { headings: number; lists: number; codeBlocks: number };
  readability: { fleschLike: number };
  coverage: { score: number };
  overall: number;
};

const wordsOf = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const headingsOf = (s: string) => (s.match(/^#{1,6}\s/mg) || []).length;
const listItemsOf = (s: string) => (s.match(/^[*-+]\s/mg) || []).length;
const codeBlocksOf = (s: string) => ((s.match(/```/g) || []).length / 2) | 0;
const maxRunOf = (s: string) => {
  let max = 1, cur = 1;
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) { cur++; if (cur > max) max = cur; } else cur = 1;
  }
  return max;
};
const stem = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

export const computeMetrics = (prompt: string, text: string): Metrics => {
  const chars = text.length;
  const words = wordsOf(text).length;
  const h = headingsOf(text);
  const lists = listItemsOf(text);
  const code = codeBlocksOf(text);
  const run = maxRunOf(text);
  const repRatio = run >= 4 ? 0.2 : 0;
  const promptKeywords = wordsOf(prompt).map(stem).filter(w => w.length > 4);
  const uniqueKw = Array.from(new Set(promptKeywords));
  const hits = uniqueKw.filter(kw => text.toLowerCase().includes(kw)).length;
  const coverage = uniqueKw.length ? hits / uniqueKw.length : 1;
  const structure = Math.min(1, (h + lists + code) / 6);
  const lengthScore = Math.min(1, words / 250);
  const readability = Math.min(1, 1 - repRatio);
  const overall = Number((0.35 * lengthScore + 0.2 * structure + 0.25 * readability + 0.2 * coverage).toFixed(3));
  return {
    length: { chars, words },
    repetition: { ratio: repRatio, maxRun: run },
    structure: { headings: h, lists, codeBlocks: code },
    readability: { fleschLike: Number((readability * 100).toFixed(1)) },
    coverage: { score: Number(coverage.toFixed(3)) },
    overall,
  };
};


