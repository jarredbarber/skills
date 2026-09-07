---
name: get-to-the-point
description: >
  Reconstruct the argument hiding inside a complex document — paper, RFC, design
  doc, spec, tutorial, blog post, or AI slop. Use when the user shares a document
  and wants to know what it claims, what it assumes, and whether the reasoning holds.
author: Jarred Barber
---

# Get To The Point

Reconstruct the argument hiding inside a document. Every document is making one, even if the author didn't realize it — a tutorial argues "do X this way," a spec argues "the system should behave like this," a design doc argues "build X because Y," a results writeup argues "we observed X, which means Y."

## The fitted-line model

To understand complicated data, you fit a line to it and analyze the residuals. The line gives you the meaning; the residuals tell you how well the line fits. The best line is the one that minimizes the residuals.

Analogously, a complex document is a point cloud of claims, evidence, caveats, and context. You can't grok a point cloud. But you can fit a **deductive chain** to it — the tightest logical structure the document's content could support — and instantly see where the fit is good and where it breaks down:

> Given assumptions A₁, A₂, ... (each with evidence)
> Subject to constraints C₁, C₂, ...
> Via mechanism M (when present)
> Via reasoning R₁, R₂, ...
> We conclude: Thesis T

The **residuals** are the gaps between this idealized chain and what the document actually provides. Where does it rely on induction instead of proof? Where does it hand-wave? Where is the evidence too weak to bear the weight? The residuals are the highest-value content in the output — they're what the critical takes must surface.

The result of this exercise is called a *GTTP* artifact (named after the skill).

## Steps

This follows a 4-step procedure: Understanding, Writing, Editing, and Verifying.

### 1. Fit the line

Read the full document. Understand it's purpose, scope, and the appropriate level of rigor expected of it. Extract the logical structure that cuts across the document's own organization. The goal is to fit every document onto the canonical chain structure, regardless of how well it naturally maps. Regularize - don't overcomplicate the chain. Note where the fit is clean and where it's being stretched.

### 2. Produce the output

Write the output following the template below. Completion: every required section is populated with content specific to this document, mechanism is populated or explicitly omitted, source locations are cited for non-reconstructed items, every assumption carries Type/Strength/Load-bearing, every reasoning step carries a status tag, every critical take names a specific residual or states why the fit is clean, and "Would change my mind" names 1-3 concrete items.

### 3. Clean up the wording

Look over the result and tighten up the wording. Reduce verbosity, eliminate unneccessary jargon. Use the `unslop` skill if you have it.  **Use a subagent** if you have that capability.

Completion: The GTTP is concise, accurate, and free of "slop" - low information telltale artifacts of AI generated writing.

### 4. Review

Do a final pass and look for major objective errors: Hallucinations, mis-representations of the document, glaring omissions. The rule of thumb: *If the original author read my GTTP, would they have cause to call me out? If so, can I defend my writing?*. **Use a subagent** to help you by playing Devil's advocate.

Completion: The GTTP accurately represents the document and claims or criticisms are defensible.

## Decomposition guidance

### Thesis

Strip jargon but **preserve scope and confidence qualifiers** — "improves latency by 20% on single-node deployments" is a different claim than "improves latency." State it in one or two plain sentences.

### Assumptions & Evidence

This is the most important section for assessing correctness. Focus on:

- **Implicit assumptions** — things the author didn't state, may not even have thought about, but the argument depends on. These are where arguments silently break.
- **Load-bearing assumptions** — if this falls, does the whole thesis collapse or just a piece?
- **Unstated alternatives** — the author assumes X, but could Y also be true?
- **Reconstructed premises** — if you invented a step to make the chain work, label it "reconstructed." This is transparent steelmanning: you're showing what you had to add to make the chain hold together, so the reader can see exactly where the document's own argument has holes.

Judge evidence strength by relevance, reliability, and directness — not volume. Name the evidence kind: citations, data, experiments, appeals to authority, worked examples.

Prioritize the 3-7 most load-bearing assumptions. A long paper rests on many background assumptions — include only those that are disputed, document-specific, necessary for a major inference, or responsible for scope. Ordinary background knowledge is out unless it's questionable in context.

### Mechanism (omittable)

Describe what the document concretely proposes to do or build — the procedure, system, model, or framework, not why it works. The mechanism should be concrete enough that a reader understands what it IS, not just what it claims to achieve. Strip away justification — that belongs in the reasoning chain.

For theory papers, the mechanism is the theoretical model or construct. For design docs, it's the proposed architecture or system. Omit for documents that are purely argumentative — critiques, rebuttals, position papers where the reasoning goes directly from assumptions to thesis with no intermediate construct.

### Constraints vs. Assumptions

Assumptions are claims about reality — valid or invalid. Constraints are **choices** imposed by external factors (budget, timeline, compatibility, regulation, organizational decisions). They aren't right or wrong — they're boundaries. Surface them because: the reader may not share the same constraints, relaxing one may open better solutions, and some constraints are assumptions in disguise.

### Reasoning Chain

Each step references its dependencies explicitly — "from A₂ and step 3" — don't imply linear dependence. This is the topological ordering of the argument graph.

Status tags:
- **follows** — the step is supported by its dependencies; the inference is sound given what came before
- **gap** — a missing premise or piece of evidence; the step needs something that isn't provided
- **hand-wave** — the document asserts the step without real justification ("it is clear that...", "obviously...")
- **leap** — the step jumps in scope beyond what the evidence supports (toy example → production claim, single benchmark → general conclusion)
- **unsupported** — no evidence or reasoning offered at all; the step is simply declared

### Conclusions

The reader should be able to read TLDR → Conclusions and walk away informed.

## Critical takes

Every major section gets a **critical take** — your honest, calibrated reaction. Praise what's strong, push back on what's weak, flag what's missing. A solid assumption with good evidence should be called solid, not strained for flaws. A shaky one should be called shaky. The best critical take is well-calibrated, not uniformly skeptical. State the basis for factual claims (from the document, external knowledge, or editorial judgment) but keep the voice informal.

## Output format

- The Background, Mechanism, and Constraints sections may be dropped when the document genuinely has nothing for them — e.g., a tutorial with no constraints. All other sections are mandatory.
- Latex formatting for equations may be used when appropriate. Use `$ $` for inline equations and the following format for display mode/block equations (**important**: blank line before and after display-mode equations).
```markdown

$$
  <equation>
$$

```
- Use bold formatting for boolean/"enum" values like **yes**, **no**.
- Unless otherwise specified, write your GTTP to a Markdown file.
- Use the following template:

```markdown
# <Document Title>: GTTP

**TLDR:** <two sentences max — the thesis, whether it holds up, and the key caveat. Minimal jargon.>

**Document type:** <paper / RFC / design doc / tutorial / spec / ...>

## Thesis

<plain statement of the central claim in one or two sentences, preserving scope and confidence>

## Stakes

- **Problem:** <what's broken/missing/unknown>
- **Who cares:** <specific audience>
- **If true:** <downstream implications>

**Critical take:** <your editorial>

## Background

<what the reader needs to already know to follow this document — domain knowledge, prior work, or terminology the document assumes without explaining>

## Mechanism

<what the document concretely proposes to do or build — the procedure, system, model, or framework, not why it works>

**Critical take:** <is the mechanism described concretely enough to evaluate? what's underspecified?>

## Assumptions & Evidence

**Assumption 1:** <plainly stated>
- *Type:* **explicit** | **implicit** | **reconstructed**
- *Source:* <section/page, or "**reconstructed**">
- *Evidence:* <what the document offers — name the kind>
- *Strength:* **strong** | **moderate** | **weak** | **missing**
- *Load-bearing?* **yes** | **no**: <what breaks if this falls>
- **Critical take:** <your read>

(repeat for each)

## Constraints

**Constraint 1:** <plainly stated>
- *Source:* <section/page>
- *Why:* <what drives this constraint>
- *Negotiable:*  **yes** | **no** | **unclear**
- **Critical take:** <is this really a constraint? what changes if relaxed?>

(repeat for each)

## Alternatives

- **Alternatives Considered:** <what the document compares against and how it dismisses them>
- **Falsifiability:** <what would disprove the thesis?>

**Critical take:** <is the comparison fair? what obvious alternatives were ignored?>

## Reasoning Chain

1. From A₁ and A₂, ... → follows | gap | hand-wave | leap | unsupported
2. Under constraint C₁, combined with step 1, ... → follows | gap | hand-wave | leap | unsupported
3. ...
n. Therefore: <thesis>

**Critical take:** <overall assessment — where are the residuals largest?>

## Conclusions

- **Holds up:** <what's solid>
- **Doesn't:** <what's weak>
- **Confidence:** strong | qualified | weak | unsupported
- **Would change my mind:** <1-3 specific things>
- **Notable:** <contradictions between sections, key evidence buried in footnotes, mismatch between abstract claims and body evidence — omit if nothing noteworthy>
```
