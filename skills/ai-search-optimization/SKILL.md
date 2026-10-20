---
name: ai-search-optimization
description: >-
  Use when auditing or improving how a brand shows up, gets cited, or gets
  recommended in AI answers (Google AI Overviews/AI Mode, ChatGPT, Perplexity,
  Claude, Gemini, Copilot), i.e. AEO/GEO/LLMO work, llms.txt, or AI crawler
  policy.
---
# AI Search Optimization (AEO / GEO)

Make content discoverable, extractable, and citable by AI systems, and earn a place on the AI-generated shortlist. Traditional SEO gets you ranked; AI SEO gets you **cited** (and ideally **recommended**).

> Output is a draft for human review. Nothing gets sent, posted, published, or launched by this skill, and no site files are changed.

## Evidence discipline

AI search behavior shifts fast. For any statistic or platform claim, check its date and weigh evidence in this order: official platform documentation → controlled experiments → large observational datasets (often vendor research) → practitioner case studies. When documentation and data conflict, follow documentation for eligibility and crawler controls and treat the data as a hypothesis. **Never turn a study's percentage into a forecast** for a specific site.

## Before starting

Read the product marketing context document if one exists. Gather:
1. **Current visibility:** does the brand appear in AI answers? Which queries matter most?
2. **Content and domain:** content types (blog, docs, comparisons, product pages), traditional SEO strength, existing schema
3. **Goals:** cited as a source, in AI Overviews for specific queries, displacing specific competitors, optimizing existing vs. new content
4. **Competition:** who gets cited where you don't; Wikipedia and review-site presence

## How AI search selects sources

| Platform | Source selection (directional) |
|---|---|
| Google AI Overviews / AI Mode | Rooted in core Search ranking and quality systems |
| ChatGPT (search) | Searches the web; cites beyond top-ranked pages |
| Perplexity | Always cites; favors authoritative, recent, well-structured content |
| Gemini | Google index + Knowledge Graph |
| Copilot | Bing index + authoritative sources |
| Claude | Training data + web search when enabled |

**Google's stance:** no special markup or files are required for AI features; don't chunk content for AI; don't write separate content for AI (risks scaled-content-abuse policy); helpful, people-first, E-E-A-T content wins; there's no AI-specific Search Console report.
**Other engines** reward extractable structure (answer passages, FAQs, comparison tables, definitions) and read machine-readable files when present. The structural patterns below help them and don't hurt Google, because they're just good organization. Strong organic rankings remain one of the best predictors of AI visibility, so treat this as a layer on top of SEO.

**Query fan-out:** AI systems expand one question into several related sub-queries. Brainstorm the 5-10 related queries for each topic and make sure your content (or site) covers them, with one owning page per fact family.

## AI visibility audit

**Step 1: Test 10-20 revenue-relevant queries** across platforms, written the way people type into a chat box, across awareness stages:
- Problem-aware: "How do I [problem]?"
- Solution-aware: "What is [category]?" / "Best [category] for [use case]"
- Product-aware: "[Brand] vs [competitor]" / "Is [brand] good for [use case]?"
- Most aware: "[Brand] pricing" / "Does [brand] integrate with [tool]?"

| Query | AI Overview | ChatGPT | Perplexity | You cited? | Competitors cited? |

AI answers are non-deterministic: run each query 3-5 times per platform and record a **rate with sample size** ("cited 3/5"). Collapse wording variants of the same intent into one core prompt. Skip prompts that wouldn't change revenue.

**Step 2: Analyze citation patterns** where competitors are cited and you aren't: structure, authority signals (stats, quotes, sources), freshness, schema, third-party presence.
Turn findings into work: if an assistant states something wrong or vague about you, the page that should state that fact isn't saying it plainly, so fix that page first. If you're absent, the sources it cites are your target list for PR, reviews, and directories.

**Step 3: Extractability check per priority page**
- Clear definition in the first paragraph
- Self-contained answer blocks that work out of context
- Statistics with cited, dated sources
- Comparison tables for "X vs Y"
- FAQ section in natural-language questions
- Schema markup (FAQ, HowTo, Article, Product, Organization)
- Named author with credentials
- Updated within ~6 months, with a visible date
- Headings that match how people phrase queries
- AI crawler policy matches discovery and training goals

**Step 4: AI bot access check.** Treat crawler tokens by purpose, not as one switch:
- **Search discovery:** OAI-SearchBot, PerplexityBot, Claude-SearchBot, meta-webindexer
- **User-triggered retrieval:** ChatGPT-User, Claude-User, Perplexity-User, meta-externalfetcher
- **Potential model training:** GPTBot, ClaudeBot, meta-externalagent
- **Google-Extended:** controls certain Gemini training/grounding uses; does **not** affect Google Search inclusion

Check robots.txt and any WAF/CDN rules for each group. Blocking a training crawler doesn't necessarily block citations; blocking discovery crawlers may.

## Optimization: three pillars

### 1. Structure (make it extractable)
AI extracts passages, not pages. Use definition blocks, step-by-step blocks, comparison tables, pros/cons, FAQ blocks, and sourced statistic blocks.
- Lead every section with the direct answer
- Keep key answer passages around 40-60 words
- H2/H3 headings phrased like real queries
- Tables for comparisons; numbered lists for processes; one idea per paragraph

### 2. Authority (make it citable)
The 2023-24 Princeton GEO research found citing sources, adding statistics, and adding expert quotations raised visibility the most (roughly +30-40% each in that study), clarity and fluency helped, and **keyword stuffing hurt** (~-10%). Lower-ranked sites gained the most.
- Specific numbers with dated sources; original data beats aggregated data
- Named authors with credentials; expert quotes with name and title
- "Last updated" dates and quarterly refreshes for competitive topics
- First-hand experience, transparent methodology (E-E-A-T)

### 3. Presence (be where AI looks)
Citation mixes vary by engine and category: company sites often earn the majority of citations, while **shortlist recommendations lean on third-party consensus** (reviews, forums, analysts, press). Measure your category's mix before choosing channels.
- Review sites for your category, kept current and consistent
- Accurate Wikipedia coverage where you're genuinely notable
- Industry publications, roundups, and comparison articles
- LinkedIn (frequently cited for professional queries; front-load the target phrase, since a post's first words shape its URL)
- YouTube (models read the text layer: title, description, captions, chapters)
- Podcasts (transcripts and show notes get crawled and cited)
- Authentic participation in relevant communities, as one surface among several
- Make every third-party profile describe you with the same segment and positioning as your About page; models look for consensus

**Citation ≠ recommendation.** The visibility ladder is retrieved → cited → mentioned → recommended. Self-promotional "best [category]" listicles can earn citations in answers that recommend competitors, especially for emerging brands.

### Content that tends to earn citations
Original research and data, definitive guides, and owned "official" pages (product, docs, pricing) with extractable structure. Format mix is volatile by platform (e.g., some engines have recently down-weighted listicles and comparison pages in favor of primary sources), so re-check per platform. Underperformers: generic unstructured posts, gated or PDF-only content, anything undated or unattributed.

### Machine-readable files (optional; not required by Google)
- **`/pricing.md`**: plain-markdown tiers with prices, billing terms, limits, and included features, kept current. Opaque or JS-rendered pricing gets skipped by AI agents comparing tools for buyers.
- **`/llms.txt`**: what the product does, who it's for, and links to key pages including pricing.
- Proof as selectable text (testimonials, ratings, logos with names), not images or widget-injected content; date changeable facts ("4.7 rating as of [month year]").

### Schema
Article/BlogPosting, HowTo, FAQPage, Product, ItemList, Review/AggregateRating, Organization. Treat schema as parsing context; don't promise a fixed citation lift.

## Monitoring

Track monthly: AI Overview presence for key queries, brand citation rate, share of AI voice vs. competitors, how AI describes the brand (sentiment and accuracy), recommendation rate (on the shortlist, not just cited), and which pages get cited plus downstream branded/direct visits.
**DIY:** top 20 queries × ChatGPT, Perplexity, Google, 3-5 runs each, logged in a sheet month over month. Use an AI-visibility monitoring tool only if one is already in place.

## What not to do

1. Write separate content "for AI"
2. Chop pages into AI-bait fragments
3. Mass-produce thin variations
4. Pursue inauthentic mentions (fake reviews, invented awards, owned "independent" review sites, community spam)
5. Treat all AI user agents as one control
6. Hide main content behind JS that doesn't render
7. Skip E-E-A-T fundamentals

## Common mistakes

Ignoring AI search; treating it as separate from SEO; no freshness signals; gating your most authoritative content; ignoring third-party presence; no structured data; keyword stuffing; hiding pricing behind "contact sales"; blocking discovery crawlers without checking their purpose; generic claims without data; not monitoring.

## Output

An audit table (queries × platforms with rates), citation-gap analysis, per-page extractability scorecard, bot-access findings, and a prioritized action list (page fixes, new content, third-party presence targets), each item tied to the evidence behind it.

---
Adapted from the `ai-seo` skill in [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) by Corey Haines. MIT License.
