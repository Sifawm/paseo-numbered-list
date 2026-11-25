// Run: node --experimental-strip-types test/numbered-list.check.ts
import assert from "node:assert/strict";
import { continuation } from "../client/numbered-list.ts";

const at = (v: string) => continuation(v, v.length)?.text ?? null;
assert.equal(at("1. sí"), "\n2. ");
assert.equal(at("intro\n9. vale"), "\n10. ");
assert.equal(at("  3.recomendación"), "\n  4. ");
assert.equal(at("hola"), null);
assert.equal(at("1. a\nlibre"), null);
assert.equal(at("1."), null); // bare number: plain break
assert.equal(continuation("2. abc", 4)?.text, "\n3. "); // caret mid-line

// Empty item ends the list: the prefix is cleared and the caret stays on that line.
assert.deepEqual(continuation("1. a\n2. ", 8), { start: 5, text: "" });
assert.deepEqual(continuation("1. a\n  2. \nmás", 10), { start: 5, text: "" });
assert.equal(continuation("2. x", 3), null); // "2. |x": text after the caret, plain break
console.log("ok");
