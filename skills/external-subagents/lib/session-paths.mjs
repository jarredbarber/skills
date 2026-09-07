import { createHash, randomBytes } from "node:crypto";
import { readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/** Deterministic, collision-resistant session directory for a given cwd. */
export function sessionDirFor(cwd) {
  const hash = createHash("sha1").update(cwd).digest("hex").slice(0, 12);
  return join(homedir(), ".external-subagents", "sessions", hash);
}

/** Short, unique-enough id for a new session (8 hex chars). */
export function generateSessionId() {
  return randomBytes(4).toString("hex");
}

/**
 * Find the session file for a short id within sessionDir.
 * Session files are named `<timestamp>_<sessionId>.jsonl` by SessionManager.
 */
export function findSessionFile(sessionDir, sessionId) {
  let entries;
  try {
    entries = readdirSync(sessionDir);
  } catch (err) {
    if (err.code === "ENOENT") return undefined;
    throw err;
  }
  const match = entries.find((name) => name.endsWith(`_${sessionId}.jsonl`));
  return match ? join(sessionDir, match) : undefined;
}
