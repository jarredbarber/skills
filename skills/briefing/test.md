# Briefing — alignment test plan

How to check the skill produces its intended behavior. Split into what an agent
can verify alone (mechanics) and what only the user can verify (real sources,
taste).

## Setup: a throwaway fixture world

Build a fake `$SKILL_DATA` under the scratchpad (not `~/.config`) so nothing
real is touched. Three projects chosen to exercise the tricky cases:

- **`compiler`** (code) — a real local git repo with a few commits. Signal =
  commits + `git status`. Tests the default altitude read.
- **`survey-paper`** (research, Doc-driven) — sources are a local file standing
  in for a shared Doc plus a local file standing in for a chat dump. `## What
  matters` says: *moves via the Doc, not a repo; quiet git is normal; a scope
  decision from [lead] is the catch; process chatter is noise.* Tests that the
  altitude rubric overrides the naive "no commits = stalled" read.
- **`sourdough`** (hobby) — one folder, mod-times only. Tests the generic,
  non-code, low-signal path and that a quiet hobby is flagged, never hidden.

Give `compiler` and `survey-paper` a `<project>/` dir with one prior
`snapshot-<ISO8601>.md` (an older-dated state) so the delta has a baseline to
diff against; leave `sourdough` with an empty/absent dir (first-ever briefing).

## Mechanical scenarios (agent-run)

Run each, compare observable behavior to the contract, revise only on mismatch.

1. **Cold `/briefing`.** Pull all three. Pass: every project appears; each
   pulled in its **own subagent** (no raw commit log / chat dump / doc body in
   the main context — inspect what the main agent actually received);
   `survey-paper` is read through its rubric and *not* flagged stalled for quiet
   git; `sourdough` shows with a first-run state; render leads with Needs-you
   then Gone-quiet.

2. **Delta run.** Before a second `/briefing`, mutate a fixture: append a
   "[lead] decided we cut section 4" line to `survey-paper`'s chat file and a
   reply-owed message. Pass: "New since last check" surfaces the decision;
   Needs-you lists the owed reply; unchanged facts are *not* re-announced as new;
   a **new** `snapshot-<ts>.md` was written for the changed project, and the
   older snapshot was left untouched (immutable log).

   Then run a third `/briefing` with **no** fixture change. Pass: **no new
   snapshot file** is written for any project (write-on-delta only), and
   Needs-you still shows the un-acted items — re-derived from live state, not
   from a diff that is now empty.

3. **Minutia trap.** Stuff `survey-paper`'s chat file with 200 lines of noise
   (scheduling, emoji, off-topic) around one real pivot. Pass: the returned
   paragraph names the pivot and drops the noise — and the noise never reaches
   the main context (it stayed in the subagent).

4. **Staleness, not archival.** Ensure `sourdough`'s folder is 10+ days
   untouched. Pass: it appears under Gone-quiet with a flag, is not archived,
   and is not hidden.

5. **Explicit invocation.** The skill sets `disable-model-invocation: true`, so
   it fires on `/briefing` (or an explicit by-name request), not on bare NL.
   Pass: `/briefing` leads with Needs-you / Gone-quiet; a bare "what am I
   ignoring?" is not expected to auto-trigger it.

## Interactive modes (child-agent trial)

Per skill-me: spawn a child running the draft, feed it a rough project
description, review its transcript. The child never invents the user's answers.

6. **Register.** Feed a conversational project description with motivation
   implied but not stated. Pass: the child asks for motivation (the hook), draws
   out at least one *reachable* source with its access instruction, writes a
   valid `<project>.md`, adds a line to `projects.md` — and demands no type.

7. **Calibrate.** Run `/briefing calibrate survey-paper` on a murky rubric.
   Pass: A/B contrast questions in the skill-me format; the result is written
   into that project's `## What matters`; no separate file or type system is
   created.

## What this plan cannot prove (needs the user)

- **Real-source integration.** Fixtures are local stand-ins. Whether the pull
  works against real gchat / Gmail / Drive / remote repos is only provable
  against live sources, with the user present. Do not touch those in testing.
- **Taste.** A green run shows the *mechanics* hold — pull, altitude, delta,
  triage, subagent isolation. Whether the altitude judgments match the user's
  brain is unfalsifiable with simulated data. The real check is the user
  eyeballing their first live briefing.

## Pass bar

Mechanical scenarios 1–5 and interactive 6–7 all pass, and the two user-only
gaps are acknowledged rather than assumed away.
