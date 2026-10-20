---
name: linkedin-post-brainstorm
description: >-
  Use when given source material (files, URLs, research, raw notes) and asked
  for LinkedIn post ideas or angles; not for writing the draft itself (use
  linkedin-post-writer).
---
# LinkedIn Post Brainstorm

Generate LinkedIn post ideas from external source material provided by the user, in the author's voice and without repeating what they've already published.

> Output is a draft for human review. Nothing gets sent, posted, published, or launched by this skill.

## Process

1. **Read all of the author's published posts (mandatory).** Note core insights already covered, data points already used, and angles already explored. **Do not suggest ideas that repeat existing coverage.**

2. **Read the author's voice guide and professional profile** (see the `author-voice-guide` skill). If none exists, ask for a few example posts and a one-line description of the author's role and audience before brainstorming.

3. **Process the provided context**: files (PDFs, documents, research), URLs (articles, announcements), or raw text and ideas.

4. **Identify 2-4 promising angles**, asking:
   - What's the unique insight for a professional audience?
   - How does it connect to the author's expertise?
   - What's the hook that works in the first ~210 characters (before LinkedIn's "see more")?
   - Is there a personal angle or company connection?

5. **Present each idea** with:
   - Proposed title
   - Core insight (1 sentence)
   - Hook approach (personal anecdote, company experience, surprising outcome, or news)
   - Why it fits the author's voice

6. **Ask the user to pick** which idea(s) to develop, and whether to save each as an idea or move straight to a draft (handled by `linkedin-post-writer`).

## Evaluation criteria

Strong LinkedIn post ideas have:
- A concrete hook in the first ~210 characters
- A clear insight that gives the reader value
- A connection to the author's areas of expertise
- Room for a personal or company angle
- A scope that fits the target word count (typically 150-250 words)

## Saving ideas

Record each chosen idea with: stage `idea`, type `linkedin-post`, title, created date, core insight, tags, and the source material it came from.

---
Adapted from the `brainstorm-linkedin` skill in [techwolf-ai/ai-first-toolkit](https://github.com/techwolf-ai/ai-first-toolkit) (plugins/content-studio) by TechWolf. MIT License.
