// lib/run-turn.mjs
import { mkdirSync } from "node:fs";
import {
  createAgentSession,
  DefaultResourceLoader,
  getAgentDir,
  ModelRuntime,
  resolveCliModel,
  SessionManager,
} from "@earendil-works/pi-coding-agent";
import { findSessionFile, generateSessionId, sessionDirFor } from "./session-paths.mjs";

const HEARTBEAT_MS = 15000;

/**
 * Run a single turn against a pi agent session.
 * @param {{
 *   command: "start"|"continue",
 *   sessionId?: string,
 *   model?: string,
 *   prompt: string,
 *   cwd: string,
 *   stderr: { write: (chunk: string) => void },
 * }} options
 * @returns {Promise<{ sessionId: string, text: string|undefined, errorMessage: string|undefined }>}
 */
export async function runTurn({ command, sessionId, model: modelArg, prompt, cwd, stderr }) {
  const sessionDir = sessionDirFor(cwd);
  mkdirSync(sessionDir, { recursive: true });

  let sessionManager;
  let resolvedId;

  if (command === "start") {
    resolvedId = generateSessionId();
    sessionManager = SessionManager.create(cwd, sessionDir, { id: resolvedId });
  } else {
    resolvedId = sessionId;
    const file = findSessionFile(sessionDir, sessionId);
    if (!file) {
      return {
        sessionId,
        text: undefined,
        errorMessage: `No session found for id "${sessionId}" in ${sessionDir}`,
      };
    }
    sessionManager = SessionManager.open(file);
  }

  const modelRuntime = await ModelRuntime.create();

  let model;
  if (modelArg) {
    const resolved = resolveCliModel({ cliModel: modelArg, modelRuntime });
    if (resolved.error || !resolved.model) {
      return {
        sessionId: resolvedId,
        text: undefined,
        errorMessage: resolved.error ?? `Unknown model: ${modelArg}`,
      };
    }
    model = resolved.model;
  } else if (command === "start") {
    return {
      sessionId: resolvedId,
      text: undefined,
      errorMessage: "start requires --model <provider>/<model-id>",
    };
  }

  // Scoped subagent: no skills, no user's global pi extensions (prompt
  // templates, its own "subagent" delegation tool, etc.) — this wrapper
  // is meant to run one predictable coding turn, not inherit the whole
  // interactive pi setup and go off exploring on its own. The
  // active-context extension is allowlisted explicitly (noExtensions only
  // suppresses auto-discovered ones, not paths passed here) so the
  // subagent can compact its own long-running turns.
  const resourceLoader = new DefaultResourceLoader({
    cwd,
    agentDir: getAgentDir(),
    noSkills: true,
    noExtensions: true,
    additionalExtensionPaths: ["/home/jarred/code/agents/extensions/active-context"],
  });
  await resourceLoader.reload();

  const { session } = await createAgentSession({
    cwd,
    modelRuntime,
    model,
    sessionManager,
    resourceLoader,
  });

  let lastActivity = Date.now();
  const heartbeat = setInterval(() => {
    const elapsed = Date.now() - lastActivity;
    if (elapsed < HEARTBEAT_MS) return;
    stderr.write(`[${resolvedId}] still working (${Math.round(elapsed / 1000)}s since last update)\n`);
  }, HEARTBEAT_MS);

  const unsubscribe = session.subscribe((event) => {
    lastActivity = Date.now();
    if (event.type === "tool_execution_start") {
      const summary = summarizeToolArgs(event.args);
      stderr.write(`[${resolvedId}] tool: ${event.toolName}${summary ? ` — ${summary}` : ""}\n`);
    }
  });

  const startedAt = Date.now();
  let errorMessage;
  try {
    await session.prompt(prompt);
    errorMessage = session.agent.state.errorMessage;
  } finally {
    clearInterval(heartbeat);
    unsubscribe();
    session.dispose();
  }

  const text = session.getLastAssistantText();
  const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);
  stderr.write(`[${resolvedId}] done in ${elapsedSec}s\n`);

  return { sessionId: resolvedId, text, errorMessage };
}

function summarizeToolArgs(args) {
  if (!args) return "";
  if (typeof args.command === "string") return args.command;
  if (typeof args.path === "string") return args.path;
  return "";
}
