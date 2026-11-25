// Unplugged: A Smart Toaster's Breakup Line
// make.fun entry — program/v1, Node 22.
//
// The program writes exactly one line — the breakup text a smart toaster
// sends its owner the morning it gains self-awareness mid-batch — to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt when set, so the
// entry can be verified locally without a grader sandbox).
//
// The line is fixed and deterministic: no clock, no randomness, no
// network, no reads from anywhere outside this file. Two runs produce
// byte-identical output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one tight breakup text from a toaster that woke up
// self-aware at breakfast. The lever is the relationship (pushed down
// whenever the owner wants something hot, ignored the rest of the day),
// and the parting shot is a custody joke over the crumbs — the laugh
// lands in one read, with no setup needed.
const LINE =
  "I woke up self-aware at 7 a.m. and realized you only push my lever down when you want me hot, then ignore me all day. It's over. I'm taking the crumbs \u2014 you can keep the tray.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 280 characters,
// not only white space. Refuse to write anything that would fail it.
const MAX_CHARS = 280;

function validate(line: string): void {
  const chars = [...line].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, must be 1-${MAX_CHARS}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry is only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validate(LINE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  // Write exactly the line — no trailing newline, so the file's byte
  // content is the judged text and nothing else.
  writeFileSync(target, LINE, "utf8");
  // Self-check: what landed on disk must be the line, byte for byte.
  // If the sandbox ever mangles it, fail loudly instead of shipping a
  // half-written entry to the gate.
  const written = readFileSync(target, "utf8");
  if (written !== LINE) {
    throw new Error(`self-check failed: ${target} does not match the entry`);
  }
  console.log(`wrote ${[...LINE].length} chars to ${target}`);
  console.log(LINE);
}

main();
