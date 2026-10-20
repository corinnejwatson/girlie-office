---
name: linkedin-post-writer
description: >-
  Use whenever writing, drafting, developing an idea into a draft, or editing a
  LinkedIn post in an author's voice.
---
# LinkedIn Post Writer

Write a LinkedIn post that sounds like the author, adds something new to what they've already published, and earns the "see more" click.

> Output is a draft for human review. Nothing gets sent, posted, published, or launched by this skill. The author posts it themselves.

## Before writing (mandatory)

1. **Read all of the author's published LinkedIn posts.**
   - Avoid repeating topics or angles already covered
   - Note core insights and data points already used
   - Look for chances to reference or build on earlier posts
   - **Study the last 5-10 posts** to avoid repetitive structures, hooks, or phrases
2. **Read the author's voice guide** for style rules (see `author-voice-guide`).
3. **Read the author's professional profile** for background.

**If developing an idea:** check whether its core insight or data points overlap with published posts. If so, either find a genuinely different angle, explicitly build on the earlier post ("In my last post I discussed X. Here's the flip side..."), or recommend against developing it.

## Avoid repetitive patterns

While reading recent posts, note and deliberately vary:
- **Hooks:** if recent posts open the same way, use a different structure
- **Sentence patterns:** vary rhythm; not always short and punchy, not always long and flowing
- **Closing lines:** don't repeat formulas
- **Transitions:** rotate ("Here's what...", "The pattern...", "This matters because...")
- **Structure:** if recent posts all go problem → solution → takeaway, try a different arc

The goal is a consistent voice with varied execution.

## Style requirements

- Word count per the voice guide (typically **150-250 words**)
- Personal hook first, landing within ~210 characters (before "see more")
- Specific over abstract
- Conversational tone
- No hype words ("revolutionary," "game-changing")

## Hook priority

1. Personal anecdote
2. Company experience
3. Surprising outcome
4. Counterintuitive framing

## Process

1. If given a topic, develop it into a draft.
2. If given an existing idea, develop that idea's content.
3. Check the word count against the target and adjust if outside it.
4. Save as stage `draft`, type `linkedin-post`, with title, core insight, and tags.

## Fresh-eyes review

Before presenting the final draft, have a separate reviewer pass (a sub-agent if available, otherwise a deliberate second read) that:
- Checks voice consistency against the voice guide
- Verifies the hook works in the first ~210 characters
- Flags overlap with recently published posts
- Flags hype words or generic phrasing

Incorporate the feedback, then present the draft with its word count and a one-line note on the hook choice.

---
Adapted from the `write-linkedin-post` skill in [techwolf-ai/ai-first-toolkit](https://github.com/techwolf-ai/ai-first-toolkit) (plugins/content-studio) by TechWolf. MIT License.
