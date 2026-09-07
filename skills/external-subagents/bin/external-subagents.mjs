#!/usr/bin/env node
import { parseArgs } from "../lib/args.mjs";
import { runTurn } from "../lib/run-turn.mjs";

const USAGE = [
  'usage: external-subagents start --model <provider>/<model-id> "<prompt>"',
  '       external-subagents continue <session-id> ["--model <provider>/<model-id>"] "<prompt>"',
].join("\n");

/** Write to a stream and exit only after the write has flushed, so piped output is never truncated. */
function writeThenExit(stream, chunk, code) {
  stream.write(chunk, () => process.exit(code));
}

async function main() {
  let parsed;
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (err) {
    writeThenExit(process.stderr, `error: ${err.message}\n${USAGE}\n`, 1);
    return;
  }

  try {
    const result = await runTurn({
      ...parsed,
      cwd: process.cwd(),
      stderr: process.stderr,
    });

    if (result.errorMessage) {
      writeThenExit(process.stderr, `error: ${result.errorMessage}\nPI_SESSION: ${result.sessionId}\n`, 1);
      return;
    }

    writeThenExit(process.stdout, `${result.text ?? "(no response)"}\n\nPI_SESSION: ${result.sessionId}\n`, 0);
  } catch (err) {
    writeThenExit(process.stderr, `error: ${err.stack ?? err.message}\n`, 1);
  }
}

main();
