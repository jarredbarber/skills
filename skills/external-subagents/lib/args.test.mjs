import { test } from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "./args.mjs";

test("start requires --model", () => {
  assert.throws(() => parseArgs(["start", "do the thing"]), /--model/);
});

test("start parses model and prompt", () => {
  const result = parseArgs(["start", "--model", "openai-codex/gpt-5.6-luna", "fix the bug in foo.ts"]);
  assert.deepEqual(result, {
    command: "start",
    sessionId: undefined,
    model: "openai-codex/gpt-5.6-luna",
    prompt: "fix the bug in foo.ts",
  });
});

test("start allows --model to appear after the prompt starts", () => {
  const result = parseArgs(["start", "fix", "the", "--model", "openai-codex/gpt-5.6-luna", "bug"]);
  assert.equal(result.model, "openai-codex/gpt-5.6-luna");
  assert.equal(result.prompt, "fix the bug");
});

test("continue requires a session id", () => {
  assert.throws(() => parseArgs(["continue"]), /session id/);
});

test("continue parses id, optional model override, and prompt", () => {
  const result = parseArgs(["continue", "a1b2c3d4", "--model", "openai-codex/gpt-5.6-sol", "now add tests"]);
  assert.deepEqual(result, {
    command: "continue",
    sessionId: "a1b2c3d4",
    model: "openai-codex/gpt-5.6-sol",
    prompt: "now add tests",
  });
});

test("continue without --model leaves model undefined", () => {
  const result = parseArgs(["continue", "a1b2c3d4", "now add tests"]);
  assert.equal(result.model, undefined);
  assert.equal(result.prompt, "now add tests");
});

test("unknown command throws", () => {
  assert.throws(() => parseArgs(["frobnicate"]), /Unknown command/);
});

test("empty prompt throws", () => {
  assert.throws(() => parseArgs(["start", "--model", "openai-codex/gpt-5.6-luna"]), /prompt is required/);
});
