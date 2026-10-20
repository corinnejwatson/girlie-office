---
name: content-performance-review
description: >-
  Use when asked to review how an author's published LinkedIn posts performed,
  find what resonates, or turn engagement patterns into recommendations for
  future posts.
---
# Content Performance Review

Find patterns that separate the author's high-performing posts from the rest, and turn them into practical recommendations for future content.

> Output is a draft for human review. Nothing gets sent, posted, published, or launched by this skill.

## Process

1. Read all of the author's published LinkedIn posts.
2. Keep only posts that have engagement data (reactions, comments, reposts, views).
3. Compare high performers against lower performers on the dimensions below.

## Analysis dimensions

**Hooks**
- Which hook styles correlate with higher engagement: personal anecdote, company experience, surprising data, news?
- What patterns work in the first ~210 characters (the "see more" cutoff)?

**Content characteristics**
- Word count vs. engagement
- Concrete examples vs. abstract concepts
- Frameworks or mental models present
- Lists/structure vs. flowing narrative

**Topics**
- Which tags or themes correlate with higher engagement
- Timing patterns, if publish dates are available

**Structure**
- Opening style (question, statement, story)
- Closing style (call to action, reflection, question)
- Paragraph length and density

## Performance tiers

Default tiers by reactions (adjust to the author's typical range):
- **High:** 100+ reactions
- **Medium:** 30-99
- **Lower:** under 30

## Output format

1. **Summary statistics**: posts analyzed, count and average engagement per tier
2. **Top performers**: the highest-engagement posts with their key characteristics (hook type, topic, word count)
3. **Pattern insights**: what distinguishes high from lower performers
4. **Recommendations**: specific, actionable guidance for future posts

Example (illustrative placeholder numbers only):

```
## Performance Summary
- Posts analyzed: 12 (with engagement data)
- High (100+): 3 | Medium (30-99): 5 | Lower (<30): 4

## Top Performers
1. "Title" - 245 reactions - Hook: personal anecdote - Topic: X - 180 words

## Key Patterns
- Personal anecdotes in the first sentence correlate with ~2x engagement
- Posts with a concrete example outperform abstract ones

## Recommendations
1. Lead with a personal or company-specific opening
2. Include at least one specific example or data point
3. Keep total length under ~220 words
```

## Notes

- Skip posts without metrics.
- Correlation is not causation. Note patterns without overclaiming.
- Watch for recency bias: newer posts may still be accumulating engagement.
- Small samples (under ~10 posts with data) only support tentative conclusions; say so.
- If useful, propose updates to the author's voice guide based on findings, for the author to approve.

---
Adapted from the `analyze-performance` skill in [techwolf-ai/ai-first-toolkit](https://github.com/techwolf-ai/ai-first-toolkit) (plugins/content-studio) by TechWolf. MIT License.
