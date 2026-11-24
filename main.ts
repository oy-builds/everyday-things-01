// Everyday Things, Two Lines — make.fun entry
// (u-suga-everyday-things-two-lines-longer-run-f8734479)
//
// Writes a two-line explanation of an everyday thing to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt),
// validates the competition gate (UTF-8, 1-400 chars, exactly
// two lines, no leading/trailing whitespace), then reads the
// file back and verifies it matches byte for byte.
//
// Node 22+, standard library only. Run with: node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE1 =
  "A toaster is a tiny tanning bed where bread lies between two glowing bars until it turns brown and crunchy, then pops up done.";
const LINE2 =
  "The tanning bed fits because the bread really does lie flat under heat until it browns, but it leaves out that bread has no skin to burn, no sunscreen, and nobody chooses the shade — the dial does.";

const ENTRY = `${LINE1}\n${LINE2}`;

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Gate: UTF-8 text, 1-400 characters, exactly two lines, not only
// whitespace. Also reject leading/trailing whitespace on either line:
// the file must hold exactly the two lines, with no padding the judge
// would read as filler.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 400) {
  fail(`entry is ${chars.length} characters, must be 1-400`);
}
const lines = ENTRY.split("\n");
if (lines.length !== 2) {
  fail(`entry must be exactly two lines, found ${lines.length}`);
}
for (const line of lines) {
  if (line.trim().length === 0) {
    fail("entry line must not be only whitespace");
  }
  if (line !== line.trim()) {
    fail("entry line must not start or end with whitespace");
  }
}
if (ENTRY !== ENTRY.trim()) {
  fail("entry must not start or end with whitespace");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, ENTRY, "utf8");

// Read back and verify byte-identical output.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  fail("verification failed: entry.txt does not match the entry");
}

console.log(`wrote ${outPath} (${chars.length} chars, ${lines.length} lines)`);
console.log(written);
