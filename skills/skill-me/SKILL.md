---
name: skill-me
description: Turn a vague agent-skill idea into a confirmed behavioral design, then build the skill.
disable-model-invocation: true
---

# Skill Me

Develop an agent skill from intent outward. The hard part is discovering what the user actually wants the agent to do; skill mechanics serve that behavioral goal.

A detailed starting point is not a different mode. It means some decisions are already settled and the work begins farther along the same path.

## Working model

- **Destination**: the change the user wants in the agent's behavior.
- **Design tree**: the decisions required to reach that destination and the dependencies between them.
- **Frontier**: every unresolved decision whose prerequisites are settled now.
- **Reaction probe**: a concrete invocation, output sketch, or failure example offered when abstract discussion no longer improves clarity.
- **Behavioral contract**: the confirmed account of intended behavior against which the skill will be written and reviewed.

Treat compliance as reliably producing the intended behavior across realistic situations, not merely following instructions literally.

## 1. Orient

Extract settled decisions from the conversation and any artifacts already provided. Find environmental facts with available tools; reserve questions for decisions the user must make.

Name the destination first. If it is still unclear, ask the smallest frontier that can clarify it before exploring implementation details.

This step is complete when the destination is clear enough to identify the next decisions without guessing what outcome the user values.

## 2. Explore the design tree

Interview in rounds. Before each round:

1. Update the design tree from everything learned so far.
2. Identify the full current frontier.
3. Ask every frontier question whose answer does not depend on another open question in that round.
4. Give a recommended answer for each question, grounded in the user's stated goal.

Use this format:

```text
❓ **Q1** - **<question title>**: <decision the user must make>

➡️ <recommended answer and brief reason>
```
Keep the question number and title in separate bold spans, separated by the literal ` - `, with the colon after the title.


The user's answers reshape the tree. Recompute the frontier rather than following a fixed questionnaire. Ask only questions that can change the resulting skill.

When language remains ambiguous, offer a reaction probe and ask what is right or wrong about it. Concrete reactions often expose intent faster than more abstract questions.

Continue until every decision that materially affects the skill's behavior is settled. Do not manufacture speculative branches: later clarity may reveal questions that cannot yet be phrased.

This step is complete when no relevant frontier remains and the behavioral contract can be stated without silent assumptions.

## 3. Confirm the behavioral contract

Present a concise intent brief containing only the dimensions relevant to this skill:

- desired behavioral change and user goal;
- representative use cases;
- expected workflow or behavioral qualities;
- human and agent responsibilities;
- constraints and non-goals;
- characteristic failure modes;
- observable evidence of success.

Ask the user to confirm that the brief captures their intent. Corrections reopen the design tree: incorporate them, recompute the frontier, and resolve any newly exposed decisions.

Begin drafting only after explicit confirmation.

This step is complete when the user confirms the intent brief.

## 4. Build the skill

Inspect the target repository's conventions and use its skill-writing guidance when available. Write the complete skill at the user's requested location, using the fewest files that express the confirmed behavior.

Translate the behavioral contract into an executable process:

- explain the purpose behind important instructions;
- make each workflow step end in a checkable completion criterion;
- preserve user judgment where the contract requires it;
- use progressive disclosure only for branch-specific material that already exists;
- remove instructions and structure that do not support the contract.

Review the draft against the intent brief. Every material promise must be represented in the skill's behavior, and every instruction must contribute to a promise. Keep the skill itself as the source of truth; do not create a separate intent file by default.

This step is complete when the requested skill is fully written and the review finds no uncovered contract element.

## 5. Offer alignment checks

Ask whether the user wants scenario checks or prefers to finish with the reviewed draft.

If the user opts in:

1. Derive three to five realistic prompts from the confirmed intent, including an ambiguous case and a tempting failure mode where relevant.
2. Let the user correct the scenarios before running them.
3. Exercise the skill and compare observable behavior with the behavioral contract.
4. Revise and rerun only where the results expose a mismatch.

For an interactive skill, prefer a live child-agent trial when the harness supports isolated agents and bidirectional messaging:

1. The parent runner starts a child agent with the draft skill and a realistic rough source or prompt.
2. The child sends every interview round and confirmation request through the harness messaging channel—`task` plus `hub` in OMP, or the equivalent—and waits for the parent's answer.
3. The parent answers as the test user from the supplied material. The child never supplies user decisions itself.
4. The child writes the confirmed intent brief and resulting deliverable to a throwaway location.
5. The parent reviews the transcript and artifacts for question sequencing, unsupported assumptions, the confirmation gate, and output alignment.

This trial measures workflow compliance and interview quality. It cannot establish whether simulated answers capture a real human's unstated intent.

Retain evaluation artifacts only when testing is chosen. Finish when the user accepts the skill or the checks show the confirmed behavior.

## Boundary

This workflow is for discovering and implementing what an agent skill should do. If the behavioral contract is already settled and the request is solely to diagnose triggering, instruction adherence, or regressions in an existing skill, use a skill-debugging or evaluation workflow instead.
