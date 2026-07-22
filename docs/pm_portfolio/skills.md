# Skills Mapping Tracker

> What you can credibly claim in interviews and on your portfolio, with the evidence to back it up.
>
> Update this file every time you ship a portfolio-relevant artifact. If you ever start to claim a skill in an interview and realize the evidence column is empty, fix it before you say it again.

**Last reviewed:** 2026-06-12

---

## Status legend

- **🟢 Evidence-backed** — you have a concrete artifact you can show.
- **🟡 In progress** — you're actively building the evidence.
- **🔴 Claim-only** — you can talk about it, but no artifact exists yet. Don't lead with these.

---

## Core PM skills

| Skill | Claim | Evidence | Status |
|---|---|---|---|
| **Product strategy** | "Defined a north star metric (% WAU at 5-day journal streak) and tied input metrics to it." | `docs/pm_portfolio/README.md` | 🟡 (pending PostHog instrumentation) |
| **User research** | "Conducted 5 user interviews on emotional self-reflection habits, synthesized themes into product decisions." | `case_studies/5_interviews.md` (not yet created) | 🔴 |
| **Roadmapping** | "Maintain a public product roadmap with prioritized backlog and dependency tracking." | `docs/ROADMAP.md`, `ai_context/active_tasks.md`, planned `/roadmap` page | 🟡 |
| **Prioritization** | "Use a decision-record system (ADRs + open-decision queue) to make and document tradeoffs." | `docs/DECISIONS.md`, `ai_context/current_state.md → Open Decisions` | 🟢 |
| **Experimentation** | "Designed and ran an A/B test on the day-2 grape unlock; paired quant signal with qualitative interview data." | `docs/pm_portfolio/ab_testing.md`, planned `case_studies/day2_grape.md` | 🟡 |
| **Data analysis** | "Defined product metrics, instrumented with PostHog, built dashboards for north star + input metrics." | PostHog dashboards (not yet built) | 🔴 |
| **Behavior change / growth design** | "Designed a streak system + reward unlock cadence (grape at day 2, hat at day 5) based on habit-formation theory." | `lib/inventory.ts`, `docs/DECISIONS.md`, planned case study | 🟡 |
| **Technical depth** | "Shipped a React Native + Supabase web app solo. Wrote all the code, deployed via GitHub Actions to Vercel." | This entire repo, live at krystal-one.vercel.app | 🟢 |
| **AI fluency / AI-augmented PM** | "Built a multi-AI collaboration framework with persistent project memory, prompt library, and inter-agent handoff protocol." | `ai_context/`, `.ai/`, `docs/grape_image_prompts.md` | 🟢 |
| **Communication / writing** | "Wrote PRD, architecture doc, decision records, and case studies for the project." | `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, planned case studies | 🟡 |

## Stretch skills (claim only if asked)

| Skill | Claim | Evidence | Status |
|---|---|---|---|
| **Cross-functional collaboration** | "Coordinated work across multiple AI agent systems (Claude, Codex, Cursor) treating each as a collaborator with distinct strengths." | `ai_context/communication_protocol.md`, `ai_context/ai_prompts.md` | 🟢 (unconventional but defensible) |
| **Go-to-market / positioning** | "Positioned a B2C wellness app in a crowded market (Reflectly, Stoic, Daylio, Finch)." | competitive scan in master case study (not yet written) | 🔴 |
| **Stakeholder management** | "Managed expectations and communication during product development." | — | 🔴 (hard to claim solo) |
| **SQL / data engineering** | "Wrote complex queries against the production Postgres database." | — (no actual SQL beyond migrations yet) | 🔴 |
| **Mobile product specifics** | "Shipped a responsive mobile-first design with dark mode and touch-target accessibility." | `tailwind.config.js`, `components/CheckInStep.tsx` (mobile responsiveness fix), dark mode rollout | 🟢 |

---

## How to upgrade a row from 🔴 to 🟢

1. Do the work that produces an artifact.
2. Write up the artifact (case study, dashboard screenshot, GitHub commit, README section).
3. Add the link or path to the **Evidence** column.
4. Flip the status to 🟢.
5. Practice telling the story in 60 seconds. If you can't, the evidence isn't tight enough yet.

## How to talk about this in interviews

**Lead with 🟢 evidence-backed skills.** Don't volunteer 🔴 claims. If they ask about a 🔴 skill, be honest: "I haven't done that yet on this project, but here's how I'd approach it."

**Frame everything around the project.** Don't say "I have product strategy skills." Say: "When I had to decide what to measure for krystal, I defined a north star — % of WAU hitting a 5-day journal streak — because it captured both depth and consistency, the two things I believed mattered most to long-term retention."

**Have one rich story per top skill.** For each 🟢 row, have a 90-second STAR-format answer ready (Situation, Task, Action, Result).

**Be honest about the unusual stuff.** The AI Generalist framework is your most distinctive piece, but it's also the most likely to confuse a traditional PM hiring manager. Frame it as: "I treated AI agents like junior team members and built a coordination system so the work could continue across multiple sessions and tools. Here's the protocol." Then show the repo.

## Quarterly review

Set a calendar reminder for the first of every month: come back to this file, update statuses, add new skills as you learn them, retire claims you can no longer defend.
