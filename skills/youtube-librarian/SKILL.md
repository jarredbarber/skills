---
name: youtube-librarian
description: Use when the user wants to retrieve, clean up, organize, analyze, summarize, or document the contents of a YouTube video from a URL. Produces an executive summary, a conceptually ordered guided analysis, and a substantive annotated transcript.
---

# YouTube Librarian

Turn a YouTube video into a durable Markdown document. The executive summary orients the reader; the guided analysis compresses the video's substantive content into the clearest conceptual progression; the annotated transcript is the cleaned source record.

## 1. Retrieve the source

1. Extract the YouTube URL from the request. Preserve the exact URL for the final source link.
2. Check that `yt-dlp` is installed:

   ```bash
   command -v yt-dlp
   ```

   If it is unavailable, stop and tell the user to install `yt-dlp` and make it available on `PATH`.

3. Create a temporary workspace and clean it up when finished:

   ```bash
   tmpdir=$(mktemp -d)
   trap 'rm -rf "$tmpdir"' EXIT
   ```

4. Retrieve metadata without downloading the video:

   ```bash
   yt-dlp --dump-single-json --skip-download "$url" > "$tmpdir/metadata.json"
   ```

   Use metadata only when it is actually available. Never expose cookies, tokens, or other credentials.

5. Retrieve English authored captions first:

   ```bash
   yt-dlp \
     --skip-download \
     --write-subs \
     --sub-langs 'en,en-US,en-GB' \
     --sub-format vtt \
     --output "$tmpdir/%(id)s.%(ext)s" \
     "$url"
   ```

6. If no usable `.vtt` file was produced, retry with automatic captions:

   ```bash
   yt-dlp \
     --skip-download \
     --write-auto-subs \
     --sub-langs 'en,en-US,en-GB' \
     --sub-format vtt \
     --output "$tmpdir/%(id)s.%(ext)s" \
     "$url"
   ```

   Inspect the resulting `.vtt` file; do not assume its filename. Keep subtitle artifacts in the temporary workspace unless the user explicitly requests them.

7. If no usable captions can be retrieved, report the concrete failure and suggest that the user provide a transcript or use another transcription tool. Never invent a transcript or summary.

## 2. Clean and understand the transcript

Read the complete VTT transcript before drafting. Normalize it by removing:

- WebVTT headers, cue identifiers, and timestamp lines
- Duplicate text caused by overlapping cues
- HTML tags and decodable HTML entities
- Caption formatting artifacts
- Obvious filler, repetition, and speech disfluencies when removal does not change meaning
- Non-meaningful music, applause, or noise markers

Preserve the speaker's substance and sequence, including names, numbers, claims, examples, qualifications, transitions, and conclusions. Lightly edit punctuation and grammar for readability. Do not silently compress, paraphrase away, or omit substantive material. If a word or passage is unclear, mark it as uncertain rather than guessing.

Before organizing the document, identify every substantive claim, explanation, example, qualification, transition, and conclusion. Build a conceptual map: which ideas depend on, explain, contrast with, or prioritize others. This map will organize the guided analysis; the annotated transcript will retain the video's sequence.

## 3. Compose the Markdown document

Use this order:

1. Title
2. Original YouTube link near the top
3. Available metadata, such as channel and publication date
4. Detailed executive summary
5. Guided analysis
6. Organized annotated transcript
7. Source notes

Use this structure as a starting point:

```markdown
# Video title

> Source: [YouTube](ORIGINAL_URL)

**Channel:** ...
**Published:** ...

## Executive summary

Explain the video's thesis, major points, conclusions, and important caveats in enough detail to orient a reader who has not watched it. This section is an orientation, not a substitute for the guided analysis or transcript.

## Guided analysis

Reconstruct the video's substantive content in the clearest conceptual order. Group related ideas even when they occur apart in the video, preserve claims, examples, qualifications, numbers, conclusions, and meaningful tensions, and make dependencies and implications explicit where that helps comprehension.

Use headings, bullets, and short prose only where they reduce reading load. The form and depth must fit the source: a list may need grouping and prioritization, while an argument may need its mechanism and caveats connected. Keep the framework fluid—no fixed template, paragraph count, or source order. Reserve a GTTP-style formal audit for an explicit request. Keep the analysis source-grounded; interpretation, not external fact-checking, is the default scope. Distinguish source claims from agent-written clarification when necessary.

The goal is a compact, linear guide from which a reader can absorb nearly all substantive information before consulting the transcript for exact wording and original sequence.

## Annotated transcript

### Descriptive section

Cleaned transcript preserving the speaker's substantive content and sequence.

> **Annotation:** Brief agent-written context, terminology, transition, or clarification where useful.

### Another descriptive section

Continue the transcript. Keep annotations sparse and clearly distinct from the speaker's words.

## Source notes

Transcript retrieved with `yt-dlp`; captions were authored or auto-generated. Note meaningful cleanup choices, uncertain passages, and any limitations.
```

The annotated transcript must be the bulk of the document and preserve the video's substantive sequence. The guided analysis may reorder ideas for comprehension but must not erase uncertainty, attribution, qualifications, or contradictions. Keep executive-summary, guided-analysis, annotations, and speaker transcript clearly distinct; do not present agent-written interpretations as quotations. Keep timestamps out by default; retain a timestamp only when the user requests timestamps or a temporal reference is necessary to resolve an ambiguity.

## 4. Choose and verify the output

Respect an explicit output path from the user. If none is supplied, choose a sensible directory based on context and a title-based Markdown filename, for example `Video Title.md`; use a useful fallback based on the video ID when no title is available. Avoid silently overwriting an existing file: ask for confirmation or choose a new filename.

Before reporting completion, verify that:

- The final file exists and is readable.
- The exact original URL appears near the top.
- `## Executive summary`, `## Guided analysis`, and `## Annotated transcript` are present.
- The guided analysis covers every substantive conceptual unit and retains the source's material claims, examples, qualifications, and conclusions in a clearer conceptual order.
- The guided analysis is materially more detailed than the executive summary while remaining substantially shorter than the transcript.
- The transcript contains the video's substantive content and is substantially longer than the executive summary, guided analysis, and annotations combined.
- The source notes identify whether captions were authored or auto-generated and mention significant cleanup or uncertainty.

Report the output path, caption provenance, and any limitations to the user.
