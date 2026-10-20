---
name: account-research-signal-plays
description: >-
  Use when researching a target or dream-list account before outreach (ABM
  brief), deciding which buying signals to act on, or mapping a fired signal to
  an outbound play and account tier.
---
# Account Research and Signal Plays

A list tells you who *could* buy. A signal tells you who might buy *now*. Research tells you the true, specific reason this account should care, and who owns the problem. Use this for ABM and dream-list accounts. (Profiles of companies you compete with belong in `competitor-profiling`.)

> Output is a draft for human review. Nothing gets sent, posted, or launched by this skill.

Signals are a timing and relevance filter; they don't replace ICP fit. A strong signal at an off-ICP company is still a skip, and a great-fit account with no signal can still get a well-aimed message built on its situation.

## Step 1: Assign the tier first

| Tier | Accounts | Research | Channels | Copy |
|---|---|---|---|---|
| **Tier 1 (1:1)** | Top ~25-50 by fit and signal | Full account brief, 10-20 min each (or an agent run reviewed by a human) | Email, LinkedIn, phone, video, possibly direct mail | Written per person; a human reviews every message |
| **Tier 2 (1:few)** | Segments of 20-200 sharing one specific pain | Segment brief + one sourced hook per contact (2-3 min) | Email + LinkedIn | Per segment with a personal opener; a human reviews a sample |
| **Tier 3 (1:many)** | Everyone else who fits | The segment definition is the research | Email | Per segment; relevance comes from a tight segment |

Keep campaigns small: campaigns of ~50 or fewer recipients tend to reply at roughly twice the rate of campaigns over 1,000.

## Step 2: Rank and stack signals

Closer to you converts better. Work down until you have enough volume:

| Rank | Signal | Why it works |
|---|---|---|
| 1 | Your own product usage (company-domain signup, plan limit hit, team invite) | They already chose you once |
| 2 | Past champions changing jobs | Former users bring the tool; win rates roughly double |
| 3 | High-intent website visits (pricing, comparison, integrations) | Active evaluation |
| 4 | Engagement with you or a competitor (comments, community questions) | Public interest in the problem |
| 5 | Hiring in the function you serve, or a new leader in it | New budget and a mandate to change |
| 6 | Funding, launches, expansion | Budget plus pressure to grow |
| 7 | Tech stack changes next to yours | A related decision is in motion |
| 8 | Generic third-party intent | Weakest and noisy |

**Stack weaker signals before acting.** A relevant hire + a complementary tool in the stack + a fit score above threshold is worth a sequence; any one alone usually isn't.

## Step 3: Respect freshness windows

| Signal | Act within | After that |
|---|---|---|
| Product usage spike / limit hit | Same day | Treat as a normal product-qualified lead |
| Pricing or comparison page visit | 24 hours | Drop to the general list |
| Champion job change | 30-90 days in the new role | They've chosen their stack |
| New leader in the function | First 90 days | Priorities are set |
| Job post for the function | While open, up to ~60 days | Hire made, budget allocated |
| Funding announcement | 30-60 days | Old news; don't congratulate |
| Tech install or removal | 30 days | Decision done |

Record the signal date on every account.

## Step 4: Map the signal to a play

| Signal | Play | Opening angle | Channel order |
|---|---|---|---|
| Product limit hit | Sales-assist | Help them get more from the plan they're outgrowing | Email from the account owner fast, then LinkedIn |
| Champion job change | Reunion | Reference the work they did with you; ask how the new team handles it | LinkedIn, then email |
| Pricing page visit (identified) | Evaluation help | **Don't mention the visit.** Lead with the decision they're probably weighing | Email, then call for Tier 1 |
| New leader in the function | First 90 days | What new leaders in that role usually fix first, with proof | LinkedIn, then email |
| Hiring for the function | Bridge the gap | What they can get done before the hire lands, or what the hire will need | Email |
| Competitor engager | Alternative | The problem they engaged with, not the competitor | LinkedIn, then email |

Write the angle as **the problem the signal implies**. "Saw you raised a Series A" is what everyone sends. "Teams that just raised are usually asked to double pipeline in two quarters, and X becomes the bottleneck" is a reason to reply.

## Step 5: Research the account

Where the useful facts are, roughly in order:
1. **Their job posts:** the problem in their words, their tools, their priorities
2. **Their own pages:** pricing, landing pages, changelog, careers, case studies
3. **What leaders say publicly:** LinkedIn posts, podcasts, talks, interviews
4. **Company news:** funding, launches, acquisitions, leadership changes, new markets, new locations
5. **Filings and reports:** for public companies, risk factors and earnings calls name priorities
6. **Reviews of their product or business:** what customers complain about shows what they're pressured to fix

### Rules for honest (agent) research
1. **Facts first, angle second.** Step one collects facts, each with a source URL and date. Step two writes the angle using only those facts.
2. **"No hook found" is a valid result.** Drop the account to the segment message rather than dress up a generic hook as personal research.
3. **Bound the angles.** Map every angle to one of your 3-5 value propositions.
4. **Date everything** and discard facts outside their freshness window.
5. **Quote, don't paraphrase,** when the hook rests on something a leader said. Keep the link.
6. **Never use sensitive traits** (health, finances, politics, religion, family), even when public.

### Tier 1 account brief

```markdown
## [Company] - account brief
**Fit:** [ICP criteria met, with gaps]
**Signal:** [what happened, date, source URL]
**Likely priority:** [the problem the signal implies, in their words where possible]
**Evidence:** [2-4 facts, each with source URL and date]
**Who owns it:** [name, title, why them; a second contact for multi-threading]
**Angle:** [one sentence connecting their situation to a value proposition]
**Proof to use:** [closest case study or result]
**Don't mention:** [anything sensitive, stale, or creepy, e.g. tracked site visits]
**Hook found:** yes / no
```

### Segment brief (Tier 2 and 3)
- What the accounts have in common (the segment definition)
- The pain that creates, with 2-3 public examples
- The proof that speaks to it
- The one-line opener each contact gets, plus the slot for a per-contact detail (Tier 2)

A tight segment does the tailoring work. "Companies that just opened their third office and posted an operations-director role" needs little per-account research because the segment already explains why you're writing.

## Hand-off

Pass the brief (or segment brief) to `cold-outbound` for copy and to `sales-enablement` for the right proof assets. Flag Tier 1 accounts where no hook was found so a human can decide.

## Common mistakes
- Treating any funding round as a buying signal for everything
- Opening with the signal itself ("Congrats on the raise") instead of using it to pick the angle
- Acting on stale signals (a six-month-old job change is just a job)
- Mentioning website visits the prospect doesn't know were tracked (reads as surveillance)
- Running every account at the same depth; tier first

---
Adapted from the `prospecting` skill's account-research and signal-plays references in [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) by Corey Haines. MIT License.
