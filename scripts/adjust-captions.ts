#!/usr/bin/env npx tsx
/**
 * Adjust caption timestamps for playback speed changes.
 * Usage: npx tsx scripts/adjust-captions.ts [speed]
 * Default speed: 1.2
 * Input: public/captions.json
 * Output: public/captions-fast.json
 */
import {readFileSync, writeFileSync} from "fs";
import path from "path";

const speed = parseFloat(process.argv[2] || "1.2");
const inputPath = path.join("public", "captions.json");
const outputPath = path.join("public", "captions-fast.json");

console.log(`Adjusting captions for ${speed}x speed...`);

const captions = JSON.parse(readFileSync(inputPath, "utf-8"));

const adjusted = captions.map((c: any) => ({
  ...c,
  startMs: Math.round(c.startMs / speed),
  endMs: Math.round(c.endMs / speed),
  timestampMs: Math.round((c.timestampMs || 0) / speed),
}));

writeFileSync(outputPath, JSON.stringify(adjusted, null, 2));
console.log(`Adjusted ${adjusted.length} captions → ${outputPath}`);
console.log(`Original duration: ${(captions[captions.length - 1].endMs / 1000).toFixed(1)}s`);
console.log(`Adjusted duration: ${(adjusted[adjusted.length - 1].endMs / 1000).toFixed(1)}s`);
