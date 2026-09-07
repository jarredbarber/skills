---
name: technical-markdown
description: Markdown style guide. Use when writing technical documents with equations or diagrams in Markdown.
---

# Technical Markdown

## Equation rules

Use LaTeX for equations.

- Use `$ ... $` for inline equations and `$$ ... $$` for display mode equations
- Use LaTeX `align*` environment for runs of equations
- LaTeX `amsmath`, `amssymb` packages are pre-loaded
- Display mode equations must follow one of two forms:

Form 1 (short equations)
```markdown
<content>

$$ <equation> $$

<content>
```

Form 2 (long equations)
```markdown
<content>

$$
  <equation>
$$

<content>
```

Form 3 (sequential equations)
```markdown
<content>

$$
\begin{align*}
    <lhs 1> &= <rhs 1> \\
    <lhs 2> &= <rhs 2> \\
    [...]
\end{align*}
$$

<content>
```

Critical components of the three forms: (1) the leading `$$` is left-aligned on its own line: no whitespace or other content before it. (2) there are blank lines above and below the equation.

## Diagram Rules

Use Mermaid diagrams over ASCII art, encased in `mermaid` code blocks:

```mermaid
<mermaid content here>
```
