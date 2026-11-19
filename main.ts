import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const source = join(import.meta.dirname, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");
const LIMIT = 1_048_576;

const bytes = statSync(source).size;
if (bytes > LIMIT) {
  console.error(`entry.png is ${bytes} bytes, over the ${LIMIT}-byte limit`);
  process.exit(1);
}

const header = readFileSync(source).subarray(0, 8).toString("hex");
if (header !== "89504e470d0a1a0a") {
  console.error("entry.png is not a PNG");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
console.log(`wrote ${target} (${bytes} bytes)`);
