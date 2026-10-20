---
name: competitor-comparison-pages
description: >-
  Use when drafting buyer-facing competitor comparison or alternative pages ("X
  alternative," "X alternatives," "You vs X," "X vs Y"), or auditing existing
  competitive assets (pages, battlecards, decks) for stale or risky claims.
---
# Competitor Comparison Pages and Competitive Asset Audit

Draft comparison and alternative pages that rank for competitive search terms, genuinely help evaluators decide, and position your product honestly. Also audit existing competitive content for stale or overclaimed statements. Internal battlecards live in `sales-enablement`; source research in `competitor-profiling`.

> Output is a draft for human review. Nothing gets sent, posted, published, or launched by this skill.

## Before starting

Read the product marketing context document if one exists. **Never guess the competitor.** If the request doesn't name one, ask and stop there.

Understand:
1. **Your product:** value proposition, differentiators, ICP, pricing model, strengths and honest weaknesses
2. **Landscape:** direct and indirect competitors, their positioning, search demand for competitor terms
3. **Goals:** SEO capture, sales enablement, converting competitor users, brand positioning

Useful inputs: common reasons people switch to you, switcher quotes, pricing vs. competitors, migration support offered.

## Core principles

1. **Honesty builds trust.** Acknowledge competitor strengths, be accurate about your limits, never misrepresent features. Readers verify.
2. **Depth over surface.** Go beyond checklists: explain why differences matter, with use cases and scenarios.
3. **Help them decide.** Be explicit about who you're best for **and** who the competitor is best for.
4. **One source of truth per competitor** so updates flow to every page.
5. **Evidence discipline** (every page should survive the competitor's own team reading it):
   - "Not observed" ≠ "doesn't have." Write "not listed on their pricing page (as of [month year])" or drop the row. Use ✗ only when their docs or a trial confirm the absence.
   - Put an "as of" date on pricing tables and competitor facts; re-verify before republishing.
   - One visit is a snapshot; claims about change over time need dated history.
   - State what changed, not why.
   - Keep their facts, your interpretation, and your recommendation visibly separate.

## Page formats

**1. [Competitor] alternative (singular)**: intent is actively switching. URL `/[competitor]-alternative`.
Structure: why people look for alternatives (validate the pain) → you as the alternative → detailed comparison (features, service, pricing) → who should switch (and who shouldn't) → migration path → switcher proof → CTA.

**2. [Competitor] alternatives (plural)**: earlier research intent. URL `/[competitor]-alternatives`.
Structure: common pains → what to look for (criteria) → 4-7 real alternatives (you first, but genuinely helpful) → summary table → breakdown of each → recommendation by use case → CTA.
Note: these pages often earn *citations* in AI answers, but AI *recommendations* depend on off-site consensus (reviews, forums, analysts). A self-ranked list can surface competitors in the AI answer while you only get the citation; set expectations.

**3. You vs [Competitor]**: direct comparison. URL `/vs/[competitor]`.
Structure: TL;DR (2-3 sentences) → at-a-glance table → comparison by category (features, pricing, support, ease of use, integrations) → who you're best for → who they're best for (honest) → switcher quotes → migration support → CTA.

**4. [Competitor A] vs [Competitor B]**: you're the third option. URL `/compare/[a]-vs-[b]`.
Structure: overview of both → comparison by category → who each is best for → the third option (you) → three-way table → CTA.

## Essential sections

- **TL;DR** for scanners at the top
- **Paragraph comparisons** per dimension: how each handles it and when it matters (not just tables)
- **Feature comparison:** strengths, limitations, bottom-line recommendation per category
- **Pricing comparison:** tier by tier, what's included, hidden costs, total cost for a sample team size, "as of" date
- **Who it's for:** explicit ideal customer for each option
- **Migration:** what transfers, what needs reconfiguration, support offered, switcher quotes

## Central competitor data (per competitor)

Positioning and audience; pricing (all tiers, dated); feature ratings; strengths and weaknesses; best for / not ideal for; common review complaints; migration notes; sources and verification dates.

## Research and upkeep

Research: hands-on product trial where possible; current pricing and hidden costs; review-site themes; conversations with customers who switched (both directions); their positioning, comparison pages, and changelog.
Upkeep: verify pricing and major features quarterly; update when a customer reports a change; full refresh annually.

## Competitive asset audit

Audit every asset making claims about competitors: vs/alternative pages, battlecards, talk tracks, objection docs, deck comparison tables.
1. **List each claim** with the asset and location.
2. **Re-verify** against the competitor's current site, docs, or changelog, recording the check date. If you can't browse, mark claims unchecked and list what to verify. Never mark a claim Current without a check date.
3. **Mark each:**
   - **Current:** still true; update source and date
   - **Changed:** now wrong; note what's true now
   - **Unverifiable:** soften to "not listed (as of date)" or remove
   - **Overclaimed:** stated as fact without a source (unconfirmed ✗, guessed motive, unevidenced "why we win"); rewrite or remove
4. **Prioritize fixes:** public pages first, then anything reps say on calls, then internal docs.
5. **Report:** assets audited, claims checked, counts by status, and a fix list with replacement wording. Fix repeated facts in the central competitor data.

## SEO notes

| Format | Primary keywords |
|---|---|
| Alternative | "[Competitor] alternative," "alternative to [Competitor]," "switch from [Competitor]" |
| Alternatives | "[Competitor] alternatives," "best [Competitor] alternatives," "tools like [Competitor]" |
| You vs | "[You] vs [Competitor]," "[Competitor] vs [You]" |
| A vs B | "[A] vs [B]," "[B] vs [A]" |

Link related comparison pages to each other, link from feature pages to relevant comparisons, and keep a hub page. Consider FAQ schema for questions like "What's the best alternative to [Competitor]?"

## Output

- **Competitor data file** (structured, e.g., YAML) for reuse across pages
- **Page drafts:** URL, meta title/description, full copy by section, comparison tables, CTAs
- **Page-set plan:** recommended pages in priority order by search demand
- **Audit report** (when auditing): status counts and prioritized fix list

---
Adapted from the `competitors` skill in [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) by Corey Haines. MIT License.
