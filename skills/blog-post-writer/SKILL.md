---
name: blog-post-writer
description: >-
  Use when writing, drafting, expanding, or editing a first-person blog post
  (800-1200 words, sectioned) in an author's established voice.
---
# Blog Post Writer

Write a longer-form blog post (800-1200 words) in the author's voice. Blog posts share the voice of the author's LinkedIn posts but go deeper.

> Output is a draft for human review. Nothing gets sent, posted, published, or launched by this skill.

## Before writing (mandatory)

1. **Read the author's published LinkedIn posts.** They're the primary style reference. Note core insights and data points already used, and chances to build on earlier posts.
2. **Read the author's published blog posts.** Avoid repeating topics, angles, or arguments; note the structure and depth of existing posts.
3. **Read the voice guide** (the same voice applies to blog posts) and the **professional profile**.

**If developing an idea:** check for overlap with published LinkedIn or blog posts. If there is overlap, find a genuinely different angle, explicitly build on the earlier piece, or recommend against developing it.

## Avoid repetitive patterns

Note and vary across recent pieces:
- **Openings:** demand signal, personal anecdote, company experience, surprising data
- **Section flow:** don't always follow problem → solution → data → close
- **Closing lines:** find fresh ways to land the argument
- **Examples:** rotate between company-specific, industry, and broader examples
- **Rhetorical devices:** if recent pieces lean on lists, try flowing narrative, and vice versa

## Style requirements

- **800-1200 words** (verify the count)
- Language per the voice guide (default English)
- **5-7 sections** with `##` headings
- **First person** throughout
- **Conversational**: read it aloud; does it sound like the author?
- **Specific over abstract**: lead with concrete examples, broaden later
- **No hype words** ("revolutionary," "game-changing," "transformative")
- **Strong opening**: the first 2-3 sentences hook with something concrete

## Structure

1. **Hook** (80-100 words): a concrete opening that pulls the reader in
2. **3-5 body sections** (150-200 words each): a clear heading and one main point each
3. **Close** (50-75 words): echo the opening or land the core argument

Each section must earn its place. If it doesn't add something the reader couldn't get from a LinkedIn post on the same topic, cut it.

## Relationship to LinkedIn posts

Blog posts often expand ideas first introduced on LinkedIn. When that happens:
- Reference the LinkedIn post briefly; don't re-explain it
- Go deeper on the angle the LinkedIn post couldn't cover in ~200 words
- Add the meta-story, the data, or the "why" behind the insight
- Reward readers who saw the LinkedIn post, and stand alone for those who didn't

## Process

1. Develop a topic or existing idea into a full draft.
2. Check the word count against 800-1200 and adjust.
3. Save as stage `draft`, type `blog-post`, with title, core insight, and tags.

## Fresh-eyes review

Before presenting, run a separate reviewer pass (a sub-agent if available) that:
- Checks voice consistency against the voice guide
- Verifies each section earns its place and adds depth beyond a LinkedIn post
- Flags overlap with published LinkedIn or blog posts
- Flags hype, generic phrasing, or sections that could be cut

Incorporate the feedback before presenting the draft.

---
Adapted from the `write-blog-post` skill in [techwolf-ai/ai-first-toolkit](https://github.com/techwolf-ai/ai-first-toolkit) (plugins/content-studio) by TechWolf. MIT License.
