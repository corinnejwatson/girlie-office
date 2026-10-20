---
name: author-voice-guide
description: >-
  Use when setting up or refreshing an author's voice guide and professional
  profile from their example posts, before any ghostwritten LinkedIn or blog
  drafting.
---
# Author Voice Guide

Build (or refresh) the two reference documents every writing skill relies on: a **voice guide** (how the author writes) and a **professional profile** (who the author is). Voice fidelity matters more than anything else in ghostwriting, so spend time getting this right.

> Output is a draft for human review. Nothing gets sent, posted, published, or launched by this skill.

## Step 1: Gather inputs

Ask for:
- The author's full name, role, company, and industry
- Their LinkedIn profile URL (if available) and any other places they publish (blog, newsletters, industry publications, conference talks)
- **15-30 example posts**, ideally with engagement numbers (reactions, comments, reposts). Text dumps, URLs, or a collected document all work.

Do not proceed until you have at least 10 substantive example posts (reshares with minimal commentary don't count), unless the author genuinely has fewer.

## Step 2: Research the author

Use web search to fill in professional background and bio (company site, conference bios), education and career history, speaking/podcasts/publications, and areas of expertise. Combine this with what the example posts reveal.

## Step 3: Analyze voice and style

From the example posts, systematically identify:

**Writing style**
- Typical post length (word-count range)
- Tone (analytical, conversational, provocative, reflective, inspirational)
- Structure patterns (numbered lists, flowing narrative, question-driven, data-first)
- Hook strategies (questions, anecdotes, data, quotes)
- Closing patterns (reflection, call to action, question, forward-looking)
- Distinctive phrases or verbal tics
- Use of emojis, special characters, formatting
- Paragraph length and rhythm

**Content themes**
- 4-7 recurring themes that form the content backbone
- For each: the core idea, example angles used, and how it connects to the author's role

**Engagement patterns**
- Which posts got the most engagement and why
- Which hook styles correlate with higher performance
- Which topics resonate most with their audience

## Step 4: Ask only what you can't infer

Fill gaps with short questions, only where examples and research don't answer them:
- Content types to support (LinkedIn only, LinkedIn + blog, etc.)
- Language(s)
- Target length, if posts vary widely ("Their posts range from X to Y words. What's the ideal target?")
- Other publication outlets

Confirm confidently inferred items instead of asking about them.

## Step 5: Write the voice guide

Use this structure:

```markdown
# Writing Guidelines: [Author]

## Core Voice & Positioning
- Focus area: [e.g., "how X changes the way Y teams work"]
- Tone: [e.g., "Conversational. Like explaining to a smart colleague over coffee."]
- Authority: [e.g., "Practitioner who has run X at scale"]

## Key Concepts (Recurring Themes)
### 1. [Theme] - [description]
Example angles: ...
(4-7 themes)

## Style Essentials
Language: simple over sophisticated; conversational (read it aloud); direct (no throat-clearing); concrete (specific examples beat abstractions).
What works: specific data points; concrete examples (real companies, real scenarios); counterintuitive insights; practical takeaways.
What to avoid: hype ("revolutionary," "game-changing," "disrupting"); unexplained jargon; binary thinking without nuance; vague claims without an example or data.
Author-specific notes: [e.g., "no em dashes," "no 'I'm excited to share...'"]

## Structure (flexible)
1. Hook - something concrete that pulls the reader in
2. Core insight - stated clearly
3. Evidence/examples - shown, not just told
4. Implication - why it matters, what to do

## Length
LinkedIn: [target, typically 150-250 words]. Under 150 is often too thin; over 300 only if the content truly needs it.
Blog: [target, typically 800-1200 words].

## LinkedIn Hooks
LinkedIn truncates at ~210 characters (about 3 lines) before "...see more". Everything before the cutoff must earn the click.
Hook types: surprising outcome, unexpected personal context, counterintuitive framing, provocative question with a concrete detail.
Principles: personal first; specificity beats abstraction; outcomes before explanations; tension creates clicks; don't give it all away.
Priority: personal anecdote > company experience > surprising outcome > counterintuitive framing > news/announcement.

## Quality Checklist
- Connects to at least one key concept
- Sounds like something the author would say
- Major claims have examples or data
- Technical concepts explained simply
- Clear takeaway
- Avoids hype and doom
- Specific, not vague
```

## Step 6: Write the professional profile

```markdown
# Professional Profile: [Author]
## Current Role - [Role] at [Company]: [one-line company description]
## Background - education; career journey (key milestones and transitions)
## Key Achievements
## Areas of Expertise - area: sub-specialties
## Thought Leadership - platforms; key topics
## Personal Philosophy - principles or worldview that shows in their writing
## Online Presence
Last updated: [date]
```

## Step 7: Build the published-post archive

Store each example post as a record so writing skills can check for overlap. Suggested fields:

```yaml
stage: published        # idea | draft | published
type: linkedin-post     # linkedin-post | blog-post
title: Post title
created: "YYYY-MM-DD"
coreInsight: One-sentence summary of the key insight
tags: [relevant-tag]
engagement: {reactions: N, comments: N, reposts: N}
audience: Who this post is for
keyConcepts: [Concept 1]
content: |-
  Full post text...
```

Use approximate dates if exact ones aren't known.

## Step 8: Summarize

Report the themes identified, the voice characteristics captured, the number of posts archived, and any open questions for the author to confirm.

## Key principles
- **Voice fidelity matters most.** The voice guide and profile are the most important files.
- **Infer before asking.** Confirm what you can determine from examples.
- **Data-driven adaptation.** Use engagement metrics to learn what works for this author specifically.
- **Less is more on content types.** Only include types the author actually creates.

---
Adapted from the `setup-content-studio` skill and writing-guideline templates in [techwolf-ai/ai-first-toolkit](https://github.com/techwolf-ai/ai-first-toolkit) (plugins/content-studio) by TechWolf. MIT License.
