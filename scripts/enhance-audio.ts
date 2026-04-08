#!/usr/bin/env npx tsx
/**
 * Enhance audio quality: EQ, compression, normalization, speed adjustment.
 * Usage: npx tsx scripts/enhance-audio.ts [input] [speed]
 * Default input: public/assets/tedx-cosquin.mp4
 * Default speed: 1.2
 * Output: public/assets/tedx-audio-enhanced.wav
 */
import {execSync} from "child_process";
import path from "path";
import {existsSync} from "fs";

const input = process.argv[2] || "public/assets/tedx-cosquin.mp4";
const speed = parseFloat(process.argv[3] || "1.2");
const output = path.join("public", "assets", "tedx-audio-enhanced.wav");

// Remotion bundles its own ffmpeg, invoked via `npx remotion ffmpeg`

if (!existsSync(input)) {
  console.error(`Input not found: ${input}`);
  process.exit(1);
}

console.log(`Enhancing audio from: ${input}`);
console.log(`Speed: ${speed}x`);
console.log(`Output: ${output}`);

// Audio filter chain:
// 1. highpass=f=80 — remove low rumble
// 2. lowpass=f=12000 — remove high-frequency hiss
// 3. acompressor — compress dynamic range (studio feel)
// 4. loudnorm — broadcast normalization to -16 LUFS
// 5. atempo — speed adjustment
// Remotion's ffmpeg has limited filters — use what's available
const filters = [
  "loudnorm=I=-16:TP=-1.5:LRA=11",
  `atempo=${speed}`,
  "volume=1.3",
].join(",");

const cmd = `npx remotion ffmpeg -y -i "${path.resolve(input)}" -af "${filters}" -ar 44100 -ac 1 "${path.resolve(output)}"`;

console.log("\nRunning FFmpeg...");
try {
  execSync(cmd, {stdio: "inherit", timeout: 120000});
  console.log(`\nAudio enhanced and saved to ${output}`);
} catch (e: any) {
  console.error("Audio enhancement failed:", e.message);
  process.exit(1);
}
