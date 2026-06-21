import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePhrasesCsv } from "../../src/lib/csv.ts";

test("parses simple text,author rows", () => {
  const { rows, errors } = parsePhrasesCsv("Keep going,Anon\nYou matter,Someone");
  assert.equal(errors.length, 0);
  assert.deepEqual(rows, [
    { text: "Keep going", author: "Anon" },
    { text: "You matter", author: "Someone" },
  ]);
});

test("author is optional → null when absent", () => {
  const { rows } = parsePhrasesCsv("Just breathe");
  assert.deepEqual(rows, [{ text: "Just breathe", author: null }]);
});

test("handles quoted fields containing commas", () => {
  const { rows } = parsePhrasesCsv('"Hello, world, and beyond",Anon');
  assert.deepEqual(rows, [{ text: "Hello, world, and beyond", author: "Anon" }]);
});

test("handles escaped quotes inside quoted field", () => {
  const { rows } = parsePhrasesCsv('"She said ""hi""",Anon');
  assert.deepEqual(rows, [{ text: 'She said "hi"', author: "Anon" }]);
});

test("skips blank lines", () => {
  const { rows, errors } = parsePhrasesCsv("First,A\n\n   \nSecond,B");
  assert.equal(errors.length, 0);
  assert.equal(rows.length, 2);
});

test("skips a header row", () => {
  const { rows } = parsePhrasesCsv("text,author\nReal phrase,Author");
  assert.deepEqual(rows, [{ text: "Real phrase", author: "Author" }]);
});

test("reports rows missing text and skips them", () => {
  const { rows, errors } = parsePhrasesCsv("Good phrase,A\n,OnlyAuthor\n,,");
  assert.equal(rows.length, 1);
  assert.equal(errors.length, 2);
  assert.match(errors[0], /Line 2/);
  assert.match(errors[1], /Line 3/);
});

test("trims surrounding whitespace on fields", () => {
  const { rows } = parsePhrasesCsv("  Spaced out  ,  Author Name  ");
  assert.deepEqual(rows, [{ text: "Spaced out", author: "Author Name" }]);
});
