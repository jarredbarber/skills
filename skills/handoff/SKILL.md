---
name: handoff
description: Prepare a short handoff document to allow another agent to pick up your work.
author: Jarred Barber
---

# Handoff

## Instructions
Write a handoff document to allow your work to continue with a fresh agent. A handoff is **not** a full summary of the conversation. 

<rules>
- Do not duplicate information stored in other artifacts (such as code, docs, urls) - reference the files/resources if needed.
- All information should be relevant to the next steps. **Exception:** Unrelated, unrecorded information that you think is **CRITICAL** to retain may be included, but should be annotated so that the next agent can properly document it elsewhere. 
- Because this is a record of **your** context, minimize extra tool calls - if you need to look it up, it doesn't need to be recorded.
</rules>

<procedure>
1. Make sure current work is committed (as appropriate for the project).
2. Decide on what the current goal is and the next steps that you plan or anticipate taking. Ask yourself what does another agent need to know to continue your work.
3. Create (or overwrite) a document `HANDOFF.md` in the current project directory following the template below
</procedure>

### Template

```markdown
# Handoff Document
Date: YYYY-MM-DD HH:MM
Project: <xyz>
Current commit id: <id> [as appropriate]
Agent information: <model> <session id> [if known: low priority if not]

## Context
<Context needed to continue work>

- Current project focus. Examples: debugging issue X, implementing feature Y, brainstorming about algorithm Z
- Current **goal** - what are we trying to achieve?
- Important files e.g:
   - foo.ts - the main module for feature Y
   - docs/fx_plan.md - Design doc for feature X
- Important skills needed. **DO NOT include this skill**
- Recent notes from advisor, relevant to next actions
- Mistakes/pitfalls/learnings that you picked up

### [OMIT THIS SECTION IF NOT RELEVANT] Non-handoff important information
This information is not directly related to the handoff, but is important to retain.

<Important information that needs to be retained that is unrelated to the next steps>
Example:
- We rejected design Z for xyz reason but the design document has not been updated to reflect this.

## Recent actions

<Outline the last few steps taken and where you left off>
Example:
- Discussed ideas I1 and I2 with the user, user showed preference for I2.
- Researched I2
- Implemented I2 as `idea_2_impl()` in `foo.py`, tracked as task #452

## Next steps

<Outline the next steps you were planning to take>
```


