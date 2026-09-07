import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sessionDirFor, generateSessionId, findSessionFile } from "./session-paths.mjs";

test("sessionDirFor is deterministic per cwd and differs across cwds", () => {
  const a1 = sessionDirFor("/home/user/project-a");
  const a2 = sessionDirFor("/home/user/project-a");
  const b = sessionDirFor("/home/user/project-b");
  assert.equal(a1, a2);
  assert.notEqual(a1, b);
  assert.match(a1, /\.external-subagents[/\\]sessions[/\\][0-9a-f]{12}$/);
});

test("generateSessionId produces 8 lowercase hex chars, and varies across calls", () => {
  const id1 = generateSessionId();
  const id2 = generateSessionId();
  assert.match(id1, /^[0-9a-f]{8}$/);
  assert.notEqual(id1, id2);
});

test("findSessionFile returns undefined when the session directory does not exist", () => {
  const dir = join(tmpdir(), "external-subagents-test-missing-dir");
  assert.equal(findSessionFile(dir, "deadbeef"), undefined);
});

test("findSessionFile returns undefined when no file matches the id", () => {
  const dir = mkdtempSync(join(tmpdir(), "external-subagents-test-"));
  writeFileSync(join(dir, "2026-01-01T00-00-00-000Z_otherid1.jsonl"), "{}\n");
  assert.equal(findSessionFile(dir, "deadbeef"), undefined);
});

test("findSessionFile finds the file whose name ends with _<id>.jsonl", () => {
  const dir = mkdtempSync(join(tmpdir(), "external-subagents-test-"));
  const expected = join(dir, "2026-01-01T00-00-00-000Z_deadbeef.jsonl");
  writeFileSync(expected, "{}\n");
  assert.equal(findSessionFile(dir, "deadbeef"), expected);
});
