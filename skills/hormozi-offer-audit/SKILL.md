---
name: hormozi-offer-audit
description: >-
  Use when scoring and improving an existing offer (landing page hero, pricing
  tier, demo/trial offer, or lead magnet) for perceived value, using Alex
  Hormozi's Value Equation, offer-enhancement levers, market filter, and
  lead-magnet quality bar.
---
# Hormozi Offer Audit

Score an **existing** offer and prescribe the highest-impact changes. Inputs can be a URL, pasted copy, or structured fields. This skill audits what exists; it does not invent offers from scratch.

> Output is a draft for human review. Nothing gets sent, posted, published, or launched by this skill, and no pricing or page is changed.

The frameworks below come from Alex Hormozi's books *100M Offers* (2021) and *100M Leads* (2023) (both titles begin with a dollar sign). They are summarized here in our own words for descriptive reference only. This skill is not affiliated with or endorsed by Alex Hormozi or Acquisition.com. Don't reproduce book passages; read the books for the full treatment.

## Ground rules

- Before scoring, confirm **what the offer is, who it's for, and the input format.**
- **Never invent the buyer's dream outcome.** Ask; if you must infer it, label it as an assumption.
- Ask what's already in the offer before suggesting bonuses or add-ons, to avoid duplicates.
- Use the lead-magnet checks only for free entry-point assets, not for paid offers.
- Run any research to fill missing inputs only after the user agrees, one dimension at a time.
- Rewrites must use claims the user can support; flag missing proof as `[NEED: ...]` instead of inventing numbers, customers, or guarantees.

## Step 1: Extract the inputs

| Dimension | What to capture | Needed |
|---|---|---|
| Offer type | Paid offer, or free lead magnet | Always |
| Input format | URL, pasted copy, or fields | Always |
| Buyer | Segment, role, sophistication | Always |
| Dream outcome | What the buyer says they want, in their words | Always |
| Price | Current price or pricing model | Paid offers |
| What's included | Everything in the package today | Paid offers |
| Distribution | Where the lead magnet lives and how people find it | Lead magnets |
| Market signals | Pain, budget, targetability, growth | Optional |

If dream outcome, buyer profile, or market signals are missing, offer optional research on each (public buyer conversations, competitor positioning, category signals). Present findings for the user to confirm before scoring.

## Step 2 (optional): Market filter

A strong offer in a weak market still struggles. Rate each PASS / WEAK / FAIL:
1. **Acute pain:** buyers feel the problem operationally and bring it up unprompted
2. **Ability and willingness to pay:** there's a budget line this could come from
3. **Reachable:** you can name the exact channel and filter to reach 100 of these buyers tomorrow
4. **Growing:** the market will be bigger in three years, not smaller

0 fails: strong. 1: manageable, design around it. 2: the ceiling is capped. 3+: reposition before more offer work. Skip for routine tests in a proven market.

## Step 3: Score the Value Equation

Perceived value rises with the size of the **dream outcome** and the buyer's **belief they'll get it**, and falls with the **time it takes** and the **effort and sacrifice** required. Raise the first two, shrink the last two; doing both compounds.

| Lever | What to look for | Audit question |
|---|---|---|
| **Dream outcome** | A result the buyer would say out loud, not a category or feature | Does the offer name the outcome, or just the tool? |
| **Perceived likelihood** | Specific proof: named customers, numbers, case studies, third-party validation, guarantees | Why would *this* buyer believe it works for them? |
| **Time delay** | How soon the first visible win arrives (day one beats week one beats month six) | When do they first see it working? |
| **Effort and sacrifice** | Setup, learning curve, migration, decisions, ongoing work, switching risk, internal politics, plus money | What are they giving up by saying yes? |

Score each lever 0-25 with one sentence of reasoning:
- **0-5:** absent or actively hurting
- **6-10:** mentioned but generic or unsupported
- **11-15:** present and specific, not a standout
- **16-20:** concrete, proof-backed, ahead of category norms
- **21-25:** exceptional; wins on this lever alone

Total = sum (0-100). Flag the **weakest lever**; at least one fix must target it. On a tie, pick the cheaper fix (reducing effort is often cheaper than producing new proof).

Common findings: hero names a category not an outcome (dream outcome <10); adjectives without proof such as "powerful" or "easy" (likelihood <10); a free trial or pilot with no stated milestone (time delay <15); "easy to start" that actually needs heavy setup (effort <10, so consider a done-for-you onboarding tier or shorter setup).

## Step 4a: Paid offers: construction and enhancement check

**Construction**
1. Is the buyer's dream outcome named?
2. Are the obstacles in their way acknowledged?
3. Does the package answer each obstacle with a specific solution?
4. Is the delivery model clear (done for you, done with you, do it yourself)?
5. Has the package been trimmed (low-value, high-cost items removed)?

**Enhancement levers** (raise demand without changing the core product). Rate each present / weak / absent, and recommend only ones that are genuinely true:
- **Scarcity:** real limits on supply or capacity (e.g., onboarding slots per quarter)
- **Urgency:** a real time reason (cohort start, price change date, event deadline)
- **Bonuses:** added items with clear, credible value tied to obstacles
- **Guarantee / risk reversal:** money-back, performance, or pilot-success terms
- **Naming:** does the offer's name or headline give a compelling reason, call out who it's for, state the goal, hint at a timeframe, and use a container word (program, sprint, pilot, package)?

Never recommend fake scarcity or urgency.

## Step 4b: Lead magnets: quality bar

A lead magnet should be a complete answer to one narrow problem that attracts the right buyer toward the paid offer. It passes only if all four are true:
1. Valuable enough that someone might pay for it
2. Narrow enough to solve in one sitting
3. Quick to consume, with fast time-to-value
4. Leads naturally to the core offer

Any "no" means it leaks leads or attracts the wrong audience.

## Step 5: Output (always this format)

1. **Score block:** overall X/100; dream outcome, likelihood, time delay, and effort each X/25 with reasoning; weakest lever flagged; market filter verdict if run
2. **Top 3 fixes,** ranked by impact-to-effort: the lever targeted, what to change, a before/after example, and why
3. **Paid-offer construction and enhancement check** (paid only)
4. **Lead-magnet quality bar** (lead magnets only)
5. **Proof gaps:** `[NEED: ...]` items that would unlock stronger claims

Before delivering, check the "after" copy for AI tells (contrast reveals, negation lists, self-answered questions, stock phrases, em dashes in short copy). See `conversion-copywriting`.

## Worked example (fictional)

Input hero: "Acme is the all-in-one client management tool. Powerful features. Easy to use. Try free for 14 days."
- Dream outcome 4/25 (category, not outcome) · Likelihood 6/25 (adjectives, no proof) · Time delay 8/25 (trial with no milestone) · Effort 10/25 (silent on setup and migration) → **28/100**, weakest: dream outcome.
- Fix 1 (dream outcome): "Cut client no-shows by [X]% in 30 days" `[NEED: verified result]`
- Fix 2 (likelihood): replace "powerful" with a named customer result and a case-study link
- Fix 3 (time delay): "Connect your calendar in 5 minutes; see your first reminders go out today"

## Pairs well with

`conversion-copywriting` for the rewrite; `product-marketing-context` for buyer language and proof; `customer-research` when the dream outcome is unknown; `sales-enablement` for ROI framing.

---
Adapted from [johnericforte/claude-skill-hormozi-offer-audit](https://github.com/johnericforte/claude-skill-hormozi-offer-audit) by Eric Forte. MIT License. Frameworks paraphrased from Alex Hormozi, *100M Offers* (2021) and *100M Leads* (2023), referenced descriptively; not affiliated with or endorsed by Alex Hormozi or Acquisition.com.
