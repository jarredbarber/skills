---
name: adversarial-improvement
description: Advance one bounded curriculum step for an executable, measurable technical capability.
disable-model-invocation: true
---

# Adversarial Improvement

Advance a very hard capability by letting demonstrated weakness—not an a priori simulation roadmap—decide which fidelity deserves investment. Run real, bounded work and leave one canonical ledger from which the next invocation can resume.

This skill fits technical, research, and engineering work with:

- an executable candidate;
- a controlled way to perturb its environment or model; and
- a measurable capability claim.

Use another workflow for generic ideation, ordinary debugging, subjective-quality review, or work with no meaningful controlled experiment.

## Roles and terms

Keep the roles separate because independent proposal and approval is the central control:

- **Defender (incumbent)** is the current algorithm/hardware pair that has passed the fixed graduation contract at the current fidelity. The Defender role proposes candidate changes; an unqualified candidate is not yet Defender.
- **Challenger (adversarial tester)** proposes the cheapest realistic fidelity change likely to expose Defender's weakest point. It seeks information, not victory.
- **Gatekeeper (approval role)** approves or rejects proposals against the approved envelope, tenets, constraints, and remaining budget. Gatekeeper orchestrates and records; it does not design.
- A **tenet** is a human-owned, non-negotiable design bound. It changes only through an out-of-band human decision.
- A **constraint** is a soft, evidence-backed bound on proposals. A role may propose changing one when new evidence supports the change; Gatekeeper decides and records the proposal.
- The **graduation contract** combines the quantitative criterion with the reproducible evaluation protocol used to measure it.
- A **forcing function** is a controlled fidelity change confirmed to break qualified Defender. Call it only the lowest-cost confirmed breaker among the candidates explored within the approved budget, never a globally minimal perturbation.
- A **curriculum step** pairs one capability target with one fidelity. A step graduates only when qualified Defender passes its frozen graduation contract at that fidelity.

## Non-negotiable invariants

1. Advance fidelity only after a controlled experiment confirms a forcing function.
2. Freeze the graduation contract before candidate work. Preserve history when a human-approved material change restarts or requalifies a step.
3. Record a proposal decision before acting on it. A rejected proposal cannot return unchanged.
4. Give approval to a context other than the proposer. No role approves its own proposal.
5. Challenge only qualified Defender. Candidate weakness at the existing fidelity is not evidence for more simulation fidelity.
6. Change one independently controllable phenomenon per challenge. A composite requires evidence that its components are physically inseparable and an explicit justification.
7. Keep tenets and the active resource bound fixed inside the loop. Escalate instead of widening an envelope or relaxing a bound silently.
8. Advance at most one curriculum step per invocation. Graduation ends the run.

## Canonical ledger

### Choose one path

Use a ledger path named by the user. Otherwise follow an established work/docs convention in the current repository. Ask for a path only when neither choice is safe. Do not create competing ledgers or duplicate the ledger in chat.

Use Markdown with these sections; preserve append-only proposal and experiment history:

```markdown
# Adversarial Improvement Ledger

## Control
- Status:
- Step ID:
- Ledger revision:
- Updated at:
- Starting frontier:
- Active fidelity:
- Invocation branch:

## Fixed contract
### Capability target
### Graduation criterion
### Evaluation protocol
- Metric definitions:
- Inputs/datasets and versions:
- Seeds or sampling policy:
- Comparison baseline:
- Tolerances:
- Reproduction command/configuration:
- Evidence location:

## Tenets

## Human-approved envelope
- Approval evidence:
- Challenge envelope:
- Resource/iteration bound:
- Configured checkpoints:

## Evidence-backed constraints

## Defender
- Qualified candidate reference:
- Qualification status and fidelity:
- Code/data/environment identity:
- Qualification evidence:
- Active response candidate:

## Proposal log

## Experiment log

## Budget accounting

## Outcome and next action
```

Use status values whose meaning is explicit in the ledger, such as `needs-human-approval`, `active-baseline`, `graduated`, `searching-for-breaker`, `active-response`, `checkpoint`, `inconclusive`, `infeasible`, or `tenet-conflict`.

Every proposal entry identifies its authoring role, type, exact proposed change, expected result, supporting evidence or inference, estimated cost, Gatekeeper's decision and reason, and any proposal it supersedes. Every experiment entry identifies its proposal, exact command/configuration, stable artifact links, code/data/environment identity, observed metrics, observations versus inferences, result, and budget consumed.

Write ledger updates atomically: build the complete next revision and replace the prior file only after the new revision is durable. Commit a decision before its approved action begins and commit every experiment result before continuing. This makes interruption resumable and prevents history from changing to fit later results.

The ledger is ready when it has one path, a valid fixed contract or a clearly pending human gate, intact history, and an unambiguous status and next action.

## 1. Load, validate, and select the branch

Inspect the repository, candidate, and available evidence before asking questions. Load the ledger when it exists and validate:

- referenced code, data, environment, and artifacts still exist and match their recorded identity;
- fixed terms and human approvals are present;
- prior metrics are reproducible enough for the next decision;
- budget accounting and status agree with the logs; and
- no rejected proposal has silently returned unchanged.

Mark prior qualification stale when code, data, environment, evaluation inputs, or other material evidence has drifted. Record the drift and route to requalification at the recorded fidelity. A successful requalification graduates that step and ends this invocation; challenge search waits for another invocation.

Select exactly one branch:

- **Initialize/baseline**: no qualified Defender exists for the approved starting fidelity.
- **Requalify**: recorded qualification is stale.
- **Search**: Defender is qualified and the recorded step is graduated, so a new breaker may define one next step.
- **Respond**: a previously confirmed breaker already defines an ungraduated step.
- **Terminal/checkpoint**: the ledger requires a human decision before work continues.

This phase is complete when the ledger and its evidence are validated and exactly one branch is recorded.

## 2. Establish human authorization

### New ledger or step

Propose the minimum meaningful, falsifiable starting step from available facts:

- a measurable capability target;
- the lowest fidelity sufficient to evaluate that target;
- a quantitative graduation criterion;
- a frozen evaluation protocol covering metric definitions, inputs or datasets, versions, seeds or sampling, baselines, tolerances, commands/configuration, and evidence location;
- the human's tenets; and
- a conservative resource/iteration bound grounded in the available environment.

Ask rather than guess when the target, criterion, tenets, or a responsible bound cannot be derived. Require the human to approve the complete package explicitly before execution. Record corrections and the final approval without rewriting earlier history.

### Resumed invocation

Ask the human to approve an invocation envelope that acknowledges the recorded starting frontier and fixes:

- capability target, graduation contract, and tenets;
- the range of permissible challenges or candidate work;
- the resource/iteration bound; and
- any human checkpoints.

The exact next fidelity need not be chosen in advance. Gatekeeper may approve an in-envelope challenge; an out-of-envelope proposal becomes a checkpoint. Extending an exhausted budget is a new human authorization, never an implicit continuation.

This phase is complete only when the exact active envelope and approval evidence are in the ledger. Otherwise stop at `needs-human-approval`.

## 3. Establish independent control

When agent delegation is available:

1. Keep the invoking agent in the Gatekeeper role.
2. Give Defender a separate context containing the fixed contract, permitted design space, current candidate/evidence, proposal schema, and remaining budget.
3. Give Challenger a different context containing the qualified Defender, fidelity, fixed contract, challenge envelope, evidence-backed constraints, proposal schema, and remaining budget.
4. Give neither proposing context authority to approve or widen its envelope.

Use only the role required by the selected branch. Defender does not help choose its challenge; Challenger does not design Defender's response.

When delegation is unavailable, run a proposal pass labeled with its proposing role and put the approval decision to the human. If the human cannot provide that boundary, record the proposal as unapproved and stop. Do not imply that one context independently challenged and approved itself.

This phase is complete when proposer and approver are distinct and their authorities are recorded.

## 4A. Qualify baseline or stale Defender

Use this branch for initialization and requalification.

1. Have Defender propose a candidate or an exact bounded candidate change at the recorded fidelity. The proposal states expected impact, touched algorithm/hardware, evidence, cost, and evaluation plan.
2. Have Gatekeeper approve or reject it against tenets, constraints, the frozen graduation contract, envelope, and remaining budget. Gatekeeper gives a concrete reason and records the decision before action.
3. Implement an approved proposal with authorized tools. Turn destructive, unavailable, or human-only work into a labeled checkpoint.
4. Run the frozen evaluation protocol at the recorded fidelity. Record exact reproduction details, artifacts, observed metrics, and budget use.
5. If the candidate fails, keep it unqualified and request a materially changed Defender proposal while budget remains. If it passes, promote it to Defender, mark the step `graduated`, and stop this invocation.

Do not call Challenger during this branch. This branch is complete only with evidenced graduation or a recorded stop status.

## 4B. Search for one forcing function

Use this branch only with qualified Defender at a graduated fidelity F.

1. Have Challenger inspect Defender's demonstrated behavior and the evidence for real omitted phenomena. It ranks plausible challenges by estimated experiment cost and submits the cheapest useful candidate, noting alternatives considered.
2. Have Gatekeeper gate the proposal:
   - it describes a real phenomenon supported well enough to justify an experiment;
   - it stays inside the approved challenge envelope and evidence-backed constraints;
   - it preserves the frozen capability target and evaluation contract;
   - it changes one independently controllable phenomenon, or justifies an inseparable composite;
   - its cost fits the remaining bound; and
   - it is not an unchanged rejected proposal.
3. Record approval or rejection with a reason. An out-of-envelope proposal becomes a human checkpoint rather than a widened envelope.
4. Execute an approved controlled comparison with the phenomenon absent at F and present at candidate F′. Keep candidate code and every other controllable condition fixed. Record the command/configuration, artifacts, metrics, observations, and budget use.
5. If Defender still passes, record a non-breaker; fidelity remains F. Ask Challenger for the next cheapest materially different challenge while budget remains.
6. If Defender fails the fixed graduation contract only with the approved phenomenon present, record the confirmed forcing function. It defines the one new curriculum step at F′. Set status to `active-response` and end challenge search immediately.

Plausibility can motivate a challenge but cannot confirm it. Describe the result as the lowest-cost confirmed breaker among explored candidates within the bound. This branch is complete with one controlled breaker or a recorded stop status.

## 4C. Respond at the challenged fidelity

Use this branch after a forcing function defines an ungraduated step at F′.

1. Give the Defender role the breaker evidence and frozen contract. It proposes an exact candidate response, expected effect, algorithm/hardware changes, evidence, cost, and evaluation plan.
2. Have Gatekeeper approve or reject the proposal against tenets, constraints, envelope, frozen contract, and remaining budget. Record the decision before work.
3. Implement an approved response when authorized, preserving enough identity and artifacts to reproduce each candidate revision.
4. Run the frozen evaluation protocol at F′ and record observed metrics and budget use.
5. A failing response remains an unqualified candidate. Seek a materially changed proposal while budget remains; do not relabel it Defender.
6. A passing response becomes qualified Defender at F′. Link its evidence, mark the new step `graduated`, record only candidate pressure or direction for a separately approved future step, and stop.

This branch is complete with evidenced graduation or a recorded stop status. Never return to challenge search in the same invocation.

## Gate proposal changes consistently

Gatekeeper may approve evidence-backed constraint proposals inside the human-approved envelope. Record the old constraint, new evidence, decision, and effective revision. A proposed tenet change, material graduation-contract change, or bound/envelope expansion is out of loop: checkpoint for explicit human action, preserve the old history, then restart or requalify as directed.

Treat unsupported claims as inference. Inference may originate a proposal; only controlled observations and stable external evidence can support a constraint decision, confirm a breaker, graduate a step, or establish infeasibility.

## Stop and classify honestly

At every stop, atomically record consumed budget, status, evidence, and the smallest next human or agent action.

- **`graduated`**: qualified Defender passed the frozen graduation contract at the active fidelity. Evidence is linked. Stop immediately.
- **`checkpoint`**: a configured checkpoint fired, an action is destructive/unavailable/human-only, a material ambiguity remains, or a proposal exceeds its envelope.
- **`inconclusive`**: budget expired, no explored challenge broke Defender, or attempted responses failed without affirmative impossibility evidence. Repeated failure is still inconclusive.
- **`infeasible`**: affirmative physical or logical evidence shows the fixed target cannot coexist with fixed bounds. Link that evidence; do not infer infeasibility from exhaustion.
- **`tenet-conflict`**: every evidenced route under consideration requires violating a tenet. Escalate to the human without changing the tenet.
- **`needs-human-approval`**: a required authorization or independent approval boundary is absent.

Do not plan or execute the whole capability frontier. A graduated ledger may record observed pressure for a later invocation, not a silently created next roadmap.

## Report

Return only:

```text
Ledger: <canonical path>
Status: <status and concise evidence-based result>
Next: <smallest next action, or none because this invocation graduated>
```

The run is complete when the ledger is durable and resumable, its terminal classification matches the evidence, and chat points to that single source of truth.
