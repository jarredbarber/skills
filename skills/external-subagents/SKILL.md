---
name: external-subagents
description: Augment your internal subagents with models from other providers to unlock capabilities and save quota.
---

## What it does

Runs an alternative LLM as a subagent via the pi coding agent's SDK. Saves Claude quota on coding/execution and verification tasks.

The subagent session has skills and extensions disabled — it only gets the core coding tools (read/bash/edit/write), no skill auto-loading, no delegation/subagent tools of its own. It will not discover or invoke skills on its own. If you want the subagent to follow a specific skill or procedure, pass that skill's file path in the prompt (e.g. `"Follow the steps in <full path to SKILL.md> to do X"`) so it reads the file itself with its `read` tool — don't just name the skill and expect it to find it.


## Starting a task

```bash
node <skill path>/bin/external-subagents.mjs start --model <provider>/<model-id> "<prompt>"
```

**DO NOT** pipe to `tail`: the tool's output is concise.

Runs in the current working directory with full coding tools (read/bash/edit/write). Prints the model's final reply to stdout, followed by a line like:

```
PI_SESSION: a1b2c3d4
```

Capture that id — it's needed to continue the conversation. On a failed turn (nonzero exit), the error goes to stderr but the session is still usable — a `PI_SESSION:` line is printed there too so you can `continue` instead of paying for a fresh `start`.

## Continuing the same session

```bash
node /home/jarred/code/agents/skills/external-subagents/bin/external-subagents.mjs continue a1b2c3d4 "<follow-up prompt>"
```

Reuses the same model as the session was started with unless you pass `--model` again. Each call is a separate turn in the same conversation — use this to review the subagent's work, give corrections, or ask follow-up questions, the same way you'd drive a human collaborator over several messages.

## Reading progress

Progress (tool calls, periodic "still working" heartbeats, timing) is written to stderr, one short line per event — check it if a call seems to be taking a while. The final answer is always the last thing on stdout, before the `PI_SESSION:` line.


## Model guide

Pass `--model <provider>/<model-id>` directly. Preferred values:

1. `openai-codex/gpt-5.6-luna` — clearly scoped implementation work, infra work, documentation, exploring ("daily driver") 
2. `openai-codex/gpt-5.6-terra` — work that requires more exploration and decisions, code reviewing
3. `openai-codex/gpt-5.6-sol` — highly complex work requiring high-level understanding and decision-making, including planning, spec, high-level or complex reviewing. 

