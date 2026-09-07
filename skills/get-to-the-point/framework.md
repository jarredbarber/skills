# Get To The Point — Framework

## Core Idea

Every document is making an argument, even if the author didn't realize it. A tutorial argues "this is how you should do X." A spec argues "this is what the system should do." A paper argues "this is true and here's why." The skill is to reconstruct that argument in canonical form regardless of how the document was written.

The canonical form is a deductive chain:

> Given assumptions A₁, A₂, ..., Aₙ (each supported by evidence)
> Subject to constraints C₁, C₂, ...
> Via reasoning steps R₁, R₂, ...
> We conclude: Thesis T

**This is the fitted line, not the data.** A complex document is a point cloud — you can't grok a point cloud. But you can instantly grok a line, and then critique the fit. The deductive chain is the idealized version of the argument: if these assumptions were true and this reasoning were airtight, the thesis would necessarily follow. The interesting analysis is in the **residuals** — the gaps between the ideal chain and what the document actually provides. Where does it rely on induction instead of proof? Where does it hand-wave? Where is the evidence too weak to bear the weight the chain puts on it?

The framework doesn't claim the document *is* a deductive argument. It reconstructs what the document would *need to be* to be airtight, then measures how well it actually fills that scaffold. The places where it doesn't are exactly the places worth scrutinizing.

## The Decomposition

### 1. Thesis

What is the document claiming? Strip away jargon but **preserve scope and confidence qualifiers** — "improves latency by 20% on single-node deployments" is a different claim than "improves latency." Hedging that narrows the claim is part of the claim, not noise.

State it in one or two plain sentences. If there are multiple claims, identify the **primary thesis** and list secondary claims separately. Many documents bury their actual thesis under layers of context — dig it out.

For non-argument documents: reframe as an implicit argument.
- Tutorial → "You should do X this way"
- Spec/RFC → "The system should behave like this"
- Design doc → "We should build X because Y"
- Results writeup → "We observed X, which means Y"

Note the document type and flag where the argument framing fits awkwardly — it's an intentionally reductive lens, and the reader should know where it's being stretched.

### 2. Stakes

Why does this exist? Three sub-questions:

- **What problem does it address?** What's broken, missing, or unknown without this?
- **Who cares?** Name the audience. Be specific — "ML researchers working on X" not "the AI community."
- **What changes if the thesis is true?** Downstream implications, what it enables or invalidates.

**Critical take:** Your editorial on whether this matters. Is the problem real or manufactured? Does the claimed impact match the actual scope? This is where you say "I'd push back on the framing here" or "this is genuinely important and undersold."

### 3. Assumptions & Evidence (interleaved)

For each assumption the document relies on:

```
**Assumption:** <state it plainly>
- Explicit or implicit or reconstructed?
- Source: <section/page/paragraph where this appears, or "reconstructed" if not in the document>
- Evidence offered: <what the document provides — citations, data, experiments, appeals to authority, worked examples>
- Evidence strength: strong / moderate / weak / missing
- **Critical take:** <your read on whether this holds up>
```

This is the most important section for assessing correctness. Focus especially on:

- **Implicit assumptions** — things the author takes for granted without defending. These are where arguments silently break.
- **Load-bearing assumptions** — if this one falls, does the whole thesis collapse, or just a piece of it?
- **Unstated alternatives** — the author assumes X, but could Y also be true? Would the thesis survive?
- **Reconstructed premises** — if you had to invent a step to make the chain work, mark it as such. "This is not stated in the document but is required for the argument to hold." This prevents the agent from steelmanning the document and then evaluating it against its own invention.

### 4. Constraints

Constraints are distinct from assumptions. Assumptions are claims about reality — they're valid or invalid. Constraints are **choices**, often imposed by external factors: budget, timeline, compatibility requirements, regulatory mandates, API limitations, organizational decisions.

A good design argument looks like: "If we assume A, and we impose constraints C, then because of reasoning R we conclude Y." The constraints aren't right or wrong — they're the boundaries within which the argument operates. But they're worth surfacing because:

- The reader may not share the same constraints
- Relaxing a constraint may open better solutions
- Some constraints are presented as assumptions when they're actually choices (and vice versa)

```
**Constraint:** <state it>
- Source: <section/page where this appears>
- Origin: <technical limitation, business requirement, regulatory, organizational>
- Negotiable? <is this truly fixed, or could it be relaxed?>
- **Critical take:** <is this actually a constraint, or is it an assumption in disguise? What opens up if you relax it?>
```

### 5. Alternatives

What was the document measured against? Every real argument is comparative — a paper has baselines, an RFC has the status quo and rejected alternatives, a design doc has other designs considered. Surface the competitive landscape:

- **What alternatives does the document acknowledge?** How are they dismissed?
- **What alternatives does the document ignore?** These are often more interesting.
- **What would falsify the thesis?** What observation or result would force a different conclusion? (This is especially useful for detecting AI slop, which is characteristically unfalsifiable.)

**Critical take:** Was the best alternative actually considered? Is the comparison fair? Are there obvious options missing from the analysis?

### 6. Reasoning Chain

Step by step, how do the assumptions + constraints arrive at the thesis?

Write it as a numbered sequence where each step follows from prior steps, stated assumptions, or constraints. Reference dependencies explicitly — "from A₂ and step 3" — rather than implying each step depends on the one before it. This is the topological ordering of the argument graph — flatten the dependency structure into a readable sequence.

This is where you expose:

- **Logical gaps** — "step 3 doesn't follow from steps 1 and 2"
- **Hand-waves** — "the document says 'it is clear that...' but it isn't"
- **Leaps of faith** — "this works in the toy example but the document doesn't address scaling"
- **Conflations** — "the document treats X and Y as equivalent but they aren't"
- **Missing modes** — the reasoning claims deductive certainty but the evidence only supports inductive confidence

**Critical take:** Your overall assessment of the reasoning. Does each step follow? Where are the gaps? Are there simpler explanations? This is where you get to say "this is load-bearing and it's sketchy" or "the reasoning is tight, I'd trust this."

### 7. Verdict

Synthesize the scattered critical takes into a consolidated assessment. The reader should be able to read the TLDR and skip straight to this section and walk away informed. Cover:

- **What holds up:** Which parts of the argument are well-supported?
- **What doesn't:** Which assumptions are shaky, which reasoning steps have gaps?
- **Confidence:** How much should the reader trust the thesis? (Strong / qualified / weak / unsupported)
- **What would change this assessment:** Name 1-3 specific pieces of evidence, experiments, or clarifications that would materially shift the verdict.

### 8. Document Map

A structural outline of the source document focused on **structural pathologies** — things the reader wouldn't notice from a normal read:

- Key evidence buried in footnotes or appendices
- Contradictions between sections
- Mismatch between abstract claims and body evidence
- The most important assumption defended in a throwaway sentence
- Sections that are mostly padding vs. sections that are load-bearing

Keep this short. Individual source locations for assumptions and constraints belong inline in those sections, not here.

---

## Output Template

```markdown
# <Document Title>

**TLDR:** <one or two sentences — the thesis, whether it holds up, and the key caveat>

**Document type:** <paper / RFC / design doc / tutorial / spec / ...>

## Thesis

<plain statement of the central claim, preserving scope and confidence>

## Stakes

- **Problem:** <what's broken/missing/unknown>
- **Who cares:** <specific audience>
- **If true:** <downstream implications>

**Critical take:** <your editorial>

## Assumptions & Evidence

**Assumption 1:** <plainly stated>
- *Type:* explicit | implicit | reconstructed
- *Source:* <section/page>
- *Evidence:* <what the document offers>
- *Strength:* strong | moderate | weak | missing
- *Load-bearing:* yes | no — <what breaks if this falls>
- **Critical take:** <your read>

**Assumption 2:** ...

(repeat for each)

## Constraints

**Constraint 1:** <plainly stated>
- *Source:* <section/page>
- *Origin:* <technical | business | regulatory | organizational | unstated>
- *Negotiable:* yes | no | unclear
- **Critical take:** <your read — is this really a constraint? what changes if it's relaxed?>

(repeat for each, omit section if no meaningful constraints)

## Alternatives

- **Considered:** <what the document compares against and how it dismisses them>
- **Missing:** <obvious alternatives not addressed>
- **Falsifiability:** <what would disprove the thesis?>

**Critical take:** <is the comparison fair? what's missing?>

## Reasoning Chain

1. From A₁ and A₂, the document argues that... → <follows | gap | hand-wave>
2. Under constraint C₁, combined with step 1... → <follows | gap | leap>
3. ...
n. Therefore: <thesis>

**Critical take:** <overall assessment of the reasoning>

## Verdict

- **Holds up:** <what's solid>
- **Doesn't:** <what's weak>
- **Confidence:** strong | qualified | weak | unsupported
- **Would change my mind:** <1-3 specific things>

## Document Map

<structural pathologies only — where the document's structure hides, buries, or contradicts its own content>
```
