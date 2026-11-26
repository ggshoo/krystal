# A/B Testing — Beginner's Guide + Experiment Log

You said you need a lot of help here. This file teaches you the basics, walks through the day-2 grape experiment as a worked example, and tracks every experiment you run.

---

## The 60-second framework

An A/B test (or "experiment", or "split test") is a controlled comparison between two versions of a thing to see which performs better on a metric you care about.

You need exactly four pieces:

1. **Hypothesis.** What you believe will happen and why.
2. **Variants.** The two (or more) versions being compared.
3. **Primary metric.** The ONE number you're using to declare a winner.
4. **Sample size.** How many users it takes to be confident the difference is real, not luck.

That's it. Everything else is plumbing.

## The hypothesis structure

A good hypothesis has a cause, an effect, and a reason. Use this template:

> **Because** [insight about user behavior], **if we** [change], **then** [metric] **will** [increase/decrease] **by at least** [X%].

Example for crystal:

> **Because** users describe needing "proof the practice is working" within the first week, **if we** reveal the grape companion at day 2 instead of day 1, **then** day-2 retention **will increase by at least** 10%.

Why the "by at least" matters: it forces you to commit to a *minimum effect size* you'd consider meaningful. If the effect ends up being +1%, that's noise — don't redesign on it. If you didn't predict 10%, you can't say afterward "well, +3% counts, ship it."

## Variants

- **Control:** the current behavior. Always include this. (You'd be amazed how often "new is worse" is the answer.)
- **Treatment:** the change you're testing.
- Sometimes you have multiple treatments (A vs B vs C). For your first experiment, just A vs B.

**One change per test.** If you test "new grape + new copy + new color" at once, you can't tell which one moved the needle. Discipline yourself.

## The primary metric

Pick ONE. Write it on a sticky note. Refuse to change it mid-experiment.

The primary metric must be:

- **Directly measurable** in your analytics tool (PostHog, in your case).
- **Sensitive to the change** — if you're changing the day-2 experience, "30-day retention" is too slow and noisy.
- **Aligned with the north star** — the metric should be a step toward "% WAU hitting 5-day streak", not opposed to it.

Secondary metrics are fine to look at, but they don't decide the outcome. They're context.

## Sample size — the part that confuses everyone

You can't just look at a chart and call a winner. The variation between two random groups of users is HUGE in small samples. With 20 users per side, even random noise will create 30%+ swings.

The intuition you need:

- **Smaller effects need more users.** Detecting "10% lift" needs maybe 1,000 users per side. Detecting "2% lift" needs more like 25,000 per side.
- **More users per side = more confidence.** With infinite users, you'd detect a 0.01% lift. With 50 users, you basically can't detect anything below ~30%.
- **Time matters because users accumulate.** If you get 30 signups per week, an experiment needing 1,000 users per side takes ~14 months. Plan accordingly.

For crystal specifically, you don't have huge traffic. **You're going to need to either**:

1. **Accept smaller experiments with larger expected effects** (test things you expect to move the needle 20%+).
2. **Run experiments longer** (4–8 weeks instead of 1–2).
3. **Use a qualitative-quantitative mix** (5 interviews + a directional A/B) rather than relying on stats alone.

Don't fake stat-power. Saying "the treatment did better" with 30 users is theater.

## PostHog setup (when you wire it up)

PostHog supports A/B tests natively via "Experiments". Workflow:

1. **Define a feature flag** in PostHog. Give it a key like `day-2-grape-unlock`. Two variants: `control` and `treatment` at 50/50.
2. **In code**, read the flag at home-page load:
   ```ts
   const variant = posthog.getFeatureFlag('day-2-grape-unlock');
   const grapeUnlocked = variant === 'control'
     ? streak >= 1  // old behavior: grape on day 1
     : streak >= 2; // new behavior: grape on day 2
   ```
3. **Define the primary metric** as a PostHog event. For day-2 retention, that's `journal_completed` filtered to users on day 2.
4. **Start the experiment.** PostHog assigns each new user a variant on first visit (sticky) and tracks the metric per variant.
5. **Wait** until you hit the recommended sample size (PostHog tells you).
6. **Read the result.** PostHog shows lift, confidence interval, and whether the result is statistically significant.

## The day-2 grape experiment — worked example

This will be your first experiment. Here's the full design:

**Hypothesis:**
> Because users need an early reward to commit to a new daily habit, if we reveal the grape companion on day 2 (instead of day 1), then day-2 retention will increase by at least 10%.

**Variants:**
- **Control:** Grape shows from day 1. (This is actually the *old* pre-current-build behavior — you'd need to revert the gating in code for the control group.)
- **Treatment:** Grape hidden until day 2 (current behavior).

**Primary metric:**
- Day-2 retention: % of users who complete a check-in on day 2 of their account.

**Secondary metrics (track but don't decide on):**
- Day-1 to day-2 conversion (subset of above)
- Journal completion rate on day 2

**Sample size:**
- For a 10% absolute lift on a baseline of ~40% retention, you need roughly **400 users per variant**. At ~30 signups/week, that's **~7 months**. Too slow.
- Revised plan: Run for **6 weeks**, accept that the experiment may be directional rather than statistically significant. Pair the result with qualitative signal from the 5 interviews — if both agree, ship the winner.

**Decision rule:**
- If treatment shows ≥10% relative lift AND qualitative interviews support the hypothesis → ship treatment.
- If treatment shows <5% lift OR is negative → ship control (revert grape-on-day-2 gating).
- If between 5% and 10% → status quo wins (don't ship a change for a small effect with weak evidence).

**Risks:**
- Day-1 users might churn if the home page feels empty without the grape. Mitigation: keep the "first day. welcome." copy strong.
- 6 weeks is a long time to leave the codebase in two states. Plan for the cleanup commit on day 43.

**Writeup:**
- Draft the case study NOW, before the experiment finishes. Frame the hypothesis, show the design. Update with results when they're in.

## Experiment log

| # | Name | Hypothesis | Status | Start date | End date | Outcome |
|---|---|---|---|---|---|---|
| E-001 | Day-2 grape unlock | grape on day 2 (vs day 1) lifts day-2 retention 10%+ | planned | — | — | — |

Add a row for every experiment. When done, link to its case study.

## Common pitfalls (read this twice)

- **Peeking and stopping early.** "Day 3 looked great, let's call it." NO. The result will move dramatically with more data. Commit to a duration and stick to it.
- **Changing the metric mid-experiment.** "This metric isn't moving but THAT one is, let's switch." NO. You can describe secondary metrics, but the primary was the deal.
- **Running multiple experiments at once on the same users.** They interact. Pick one. Run it. Move to the next.
- **Forgetting the cleanup.** After you pick a winner, REMOVE the losing variant from code. Don't let dead branches accumulate.
- **Confusing significance with importance.** "Statistically significant" just means "probably not luck". A 0.5% lift can be statistically significant and *still not worth shipping* because the cost of maintaining the change outweighs the benefit.

## Resources

- **"Trustworthy Online Controlled Experiments"** by Ron Kohavi (the bible — read the first 3 chapters, skip the rest until you need it)
- **PostHog Experiments docs** — practical setup
- **Evan Miller's sample size calculator** — bookmark it: https://www.evanmiller.org/ab-testing/sample-size.html
