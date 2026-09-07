---
name: briefing
description: >
  Cross-project status briefing. Pulls the live state of every active project
  — yours and other people's — from the sources each project declares, and
  shows it in one scannable place with what changed since last time surfaced.
  Use when the user wants to see where all their projects stand, asks "what am
  I working on", "what have I been neglecting", "what did they decide", "project
  status", or invokes /briefing. Also registers projects ("add this to my
  briefing") and calibrates what matters ("/briefing calibrate <project>").
disable-model-invocation: true
---

# Briefing

Show the user the live state of all their active projects — their own work and
what other people are doing — pulled fresh from wherever that state lives, so
they re-engage with what they lost track of without having to remember it
first.

If the user could remember which projects needed attention and what others had
decided, they wouldn't need this. The briefing **pulls** — it runs each
project's declared sources and synthesizes them. It never waits for anyone,
human or agent, to have pushed a status. Anything an agent can reach is a valid
source.

## Where things live

`$SKILL_DATA` is `~/.config/briefing.skill`.

```
~/.config/briefing.skill/
├── projects.md                 # the active project list (names, one line each)
├── <project>.md                # one config per project (see below)
├── <project>/                  # immutable snapshot log — the diff baseline AND the arc
│   └── snapshot-<ISO8601>.md   # one per run that changed state; newest = last pull
└── dashboard.md                # last full render, the durable one-place copy
```

Archived projects move to `archive/` and only on explicit request. Staleness is
never a reason to archive — a project the user lost track of is the whole point.

### A project config file

```markdown
# <Project Name>

<Motivation — why this matters, in the user's words. Captured fresh at
registration. This is the re-entry hook; it's the first thing forgotten and
the first thing needed to re-engage.>

## Sources
- <free-form entry, each carrying its own access instruction>
- Repo: `git -C ~/code/foo log --oneline -15` and `git -C ~/code/foo status -s`
- Team chat: `gchat_cli read xs93j2 --since=<newest snapshot ts>`
- Design doc: https://docs.example/abc  (fetch it)
- Watch: decisions from [person], replies owed to [person]

## What matters
<The significance rubric the briefing applies when reading raw source output.
What counts as progress vs. a stall for THIS project; what's signal vs. noise;
whose decisions to catch. E.g. "moves via the shared Doc, not the repo — quiet
weeks in git are normal; a scope decision from [lead] is the thing to catch;
config-tweak commits are noise.">
```

## The briefing (default — `/briefing`)

Read `projects.md`. Then **dispatch one subagent per project, in parallel** —
this is the load-bearing move. A pull returns commit logs, chat dumps, whole
doc bodies; that raw volume must never reach the main context, or the render
drowns in the minutia this tool exists to filter. Each subagent does the pull
and hands back only the finished paragraph and flags. The main context holds
one paragraph per project, nothing rawer.

Give each subagent the resolved `$SKILL_DATA/<project>/` path, its config, and
this task:

1. **Pull.** Run each source's access instruction as written. Fetch URLs, chat,
   docs, email — whatever it names. Sources are user-configured and may reach
   any infrastructure. Run independent calls together.
2. **Read at altitude.** Apply the project's `## What matters` to the raw output
   to separate signal from noise. A wall of chat or a doc diff becomes the two
   or three things that actually moved — never the minutia.
3. **Diff.** Compare against the newest snapshot in `<project>/` — its timestamp
   is the last pull, so pass it to any source that takes a `--since`. Find
   what's new since then: decisions others made, messages owed a reply, a
   project that went silent. Old state stays for context; new state is called
   out. If a source fails to pull, carry its facts forward from that snapshot
   and note it unreachable — never record it as empty, or a dead source fakes a
   "gone quiet." No prior snapshot (first-ever briefing): pull the full recent
   window, treat everything as the baseline, and call none of it new.
4. **Synthesize** one tight paragraph, in this order:
   - **Why you cared** — the motivation, verbatim in spirit.
   - **Where it stands** — current state from the pull.
   - **New since last check** — the delta, or "nothing new."
   - **Trajectory** — moving / stalled / waiting-on-whom. Time since last
     activity is the primary signal, read through `## What matters`.
5. **Return** the paragraph plus explicit flags for the render. Needs-you items
   are derived from **current live state** (a reply still unsent, a doc still out
   of sync with a decision), independent of the diff — so an item keeps
   surfacing until actually resolved, not just on the run where it's new. Also
   flag whether the project is stale: its `## What matters` defines what stale
   means for it (a Doc project idles for weeks normally; a dirty tree abandoned
   3 days is a stall); fall back to 7+ days quiet only when it says nothing.

   Then persist state: if the diff found a real delta, write a new
   `<project>/snapshot-<ISO8601>.md` capturing the full current facts (latest
   commit, last message timestamp, current decisions). **One file per run that
   changed something** — skip the write when nothing changed, so the log is a
   readable arc, not a heartbeat, and the newest file stays the true diff
   baseline. Never edit or delete an existing snapshot; the log is immutable.

When every subagent returns, render the digest from their paragraphs and flags,
top to bottom:

- **Needs you** — across all projects: replies owed, decisions not yet acted on,
  anything waiting on your input. This is what hyperfocus buries. Derive it from
  **current live state** (the reply still unsent, the doc still out of sync with
  a decision), not from the diff — so an item keeps surfacing until you actually
  resolve it, even though advancing the snapshot means it stops being "new."
- **Gone quiet** — projects the subagents flagged stale (each by its own
  `## What matters`, 7+ days as the fallback), flagged, never hidden.
- **The portfolio** — every project, one paragraph, most-active first, stale at
  the bottom with their flags.

Show every active project every time — the user can't remember which have
updates, so "only things that changed" defeats the purpose. Keep it scannable
in under a minute. Ask the user nothing before showing results — no homework.

Last, write the render to `dashboard.md` — the durable copy the user can reopen
any time without running a briefing (e.g. offline, or a quick glance).

Done when: every active project appears (each pulled in its own subagent so no
raw source output reached the main context), the delta is computed against real
snapshots, and Needs-you / Gone-quiet lead the render.

## Drilling in (`/briefing <project>`)

Same per-project subagent, one project, full depth: it returns the recent
activity itself — the actual messages, the commit list, the doc changes —
curated through the altitude rubric rather than compressed to a paragraph. The
subagent still absorbs the raw fetch; what returns is the detail worth reading,
not the unfiltered dump.

For the "what was I even doing on this?" case — a project you haven't thought
about in weeks — the subagent reads the snapshot log in `<project>/` in order
and opens with the arc (how the state moved while you were away) before the
current detail. This is what the immutable log buys you: any single snapshot
shows a point in time, and the sequence reconstructs the story. "deep" on the
whole portfolio does this for every project.

## Register a project ("add this to my briefing" / `/briefing add`)

The user describes it conversationally. Extract and write `<project>.md`:

- **Name** — a short kebab slug, becomes the filename. Derive it from what they
  call the project; if they didn't name it, pick one and confirm.
- **Motivation** — why it matters. Ask if they don't offer it; it's the hook.
- **Sources** — where signal lives and *how to reach each* (the access
  instruction, not just a name). Ask what exists: repos, folders, chat, docs,
  email, people to watch, commands to run.
- **What matters** — a first pass at the significance rubric from what they say.
  If it's murky, leave a thin version and mention `/briefing calibrate`.

Add a one-line entry to `projects.md`. Offer to register any new source the
briefing stumbles on mid-run.

Done when: the config exists with motivation and at least one reachable source,
and the project is in `projects.md`.

## Calibrate what matters (`/briefing calibrate <project>`)

Optional, only when asked — for a project whose signal is murky. Draw out the
`## What matters` rubric by contrast: show two candidate updates and ask which
tells them something real.

```text
❓ **Q1** - **Progress**: Which says more about this project?

**A:** "Ran 3 experiments, 2 positive"
**B:** "Approach X isn't working — pivoting to Y"

➡️ <recommendation>
```

Cover what progress means here, what a stall looks like, what's noise, and whose
decisions to catch. Write the result into that project's `## What matters`. No
project-type system, no separate files — it lives in the one config.

Done when: the project's `## What matters` reflects the distinctions drawn.

## Archive a project (`/briefing archive <project>`)

Only on explicit request — never because a project went stale. Move its
`<project>.md` and `<project>/` snapshot log into `archive/`, and drop its line
from `projects.md`. It stops appearing in briefings but stays recoverable.
