# PM Portfolio Track

> Crystal is Gigi's headline PM portfolio piece. This directory captures the **portfolio-facing work** that runs parallel to product development: metrics, research, experiments, and the skills evidence trail.
>
> If you're an AI agent and the human asks about PM positioning, interview prep, case studies, or what to put on the portfolio site, start here.

---

## North star metric

> **% of weekly active users who hit a 5-day journal streak**

A weekly active user (WAU) is anyone who completed ≥1 daily check-in in the trailing 7 days. The numerator is WAUs whose current journal streak (consecutive days with non-empty journal content) is ≥ 5.

**Why this metric:**

- A 5-day streak crosses the day-5 hat unlock — the user has experienced at least one reward moment.
- It requires depth (journaling) and consistency (5 days). Both are core to the product's theory of change.
- It's a *leading* indicator for long-term retention. Users who hit 5 days are far more likely to hit 30.
- It's a single number a recruiter can grok in 5 seconds.

**Why not the alternatives:**

- *DAU* — too noisy, doesn't capture depth.
- *MAU* — too lagging, takes a month to move.
- *Average journal length* — depth signal but ignores consistency.
- *7-day or 30-day streak* — same idea, but 5 is the first earned-reward milestone, so it has product-meaningful UX significance.

## Input metrics (lead indicators)

These feed the north star. Track all four on the dashboard.

| Metric | Definition | Where it shows up |
|---|---|---|
| **Day-1 retention** | % of users who do ≥1 check-in on day 1 *and* day 2 of their account | Onboarding quality |
| **Day-2 retention** | % of users who check in on day 2 specifically (the grape-unlock day) | Hypothesis: grape reveal drives this |
| **Journal completion rate** | % of completed check-ins where the user also wrote ≥1 non-empty journal field | Depth signal |
| **Hat unlock rate** | % of users who reach a 5-day journal streak | This IS the north star numerator, expressed as a flow metric |

## Sub-tracks

| File | What it's for |
|---|---|
| [`user_interviews.md`](./user_interviews.md) | Playbook + interview log + synthesis notes |
| [`ab_testing.md`](./ab_testing.md) | Beginner's guide + experiment design + results |
| [`skills.md`](./skills.md) | Skills claims tracker — what you can credibly say in interviews, with evidence |
| `case_studies/` | Individual portfolio write-ups (created as the work is done) |

## Status

| Item | Status | Next step |
|---|---|---|
| North star metric defined | ✓ done | Instrument with PostHog |
| Input metrics defined | ✓ done | Instrument with PostHog |
| User interview playbook | ✓ written | Recruit 5 participants |
| A/B testing playbook | ✓ written | Design + run the day-2 grape experiment |
| Skills mapping tracker | ✓ initialized | Update after each portfolio milestone |
| First case study (D-001 streak rule) | not started | After streak rule decision + data |
| Public roadmap page on crystal.gigihsu.com | not started | Build `/roadmap` route |
| `/process` page on portfolio site | not started | Document the AI Generalist workflow |

## Two moves for this week

1. **Wire up PostHog + instrument the north star + 4 input metrics.** ~90 minutes. Until this is live you're flying blind.
2. **Write the day-2 grape case study skeleton.** ~60 minutes. Frame the hypothesis, show the design, commit to measuring. Publishes before the experiment finishes — you're showing process, not outcomes.

After those two: recruit 5 interview participants and run the experiment.
