/**
 * Parse CLI arguments for external-subagents.
 * @param {string[]} argv - process.argv.slice(2)
 * @returns {{ command: "start"|"continue", sessionId?: string, model?: string, prompt: string }}
 */
export function parseArgs(argv) {
  const [command, ...rest] = argv;

  if (command !== "start" && command !== "continue") {
    throw new Error(`Unknown command: "${command ?? ""}". Expected "start" or "continue".`);
  }

  let sessionId;
  if (command === "continue") {
    sessionId = rest.shift();
    if (!sessionId) {
      throw new Error("continue requires a session id as its first argument");
    }
  }

  let model;
  const promptParts = [];
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === "--model") {
      i++;
      model = rest[i];
      if (!model) {
        throw new Error("--model requires a value, e.g. --model openai-codex/gpt-5.6-luna");
      }
    } else {
      promptParts.push(arg);
    }
  }

  const prompt = promptParts.join(" ").trim();
  if (!prompt) {
    throw new Error("A prompt is required");
  }
  if (command === "start" && !model) {
    throw new Error("start requires --model <provider>/<model-id>");
  }

  return { command, sessionId, model, prompt };
}
