# Emotion → Grape Reference

**Visual source of truth:** `Gemini_Generated_Image_8i59q8i59q8i59q8.png` (repo root) —
_"76 Emotions: The Grape Edition"_.

This doc canonicalizes the 76 tertiary ("end") emotions used across Crystal. It
must stay in sync with:

- `lib/emotions.ts` — the in-app taxonomy (`EMOTIONS`)
- `supabase/migrations/006_replace_taxonomy.sql` — the DB seed
- the grape chart PNG above — the illustration for each end emotion

Structure: **7 primaries → secondaries → 2 tertiaries each.** The tertiaries are
the "end emotions." Labels below are the source of truth; the chart's printed
numbering is AI-generated and unreliable (it repeats and mislabels some cells),
so trust the words, not the numbers.

---

## HAPPY  (`#F5D547`)

| Secondary | End emotions |
|---|---|
| Playful | Aroused, Cheeky |
| Content | Free, Joyful |
| Interested | Curious, Inquisitive |
| Proud | Successful, Confident |
| Accepted | Respected, Valued |
| Powerful | Courageous, Creative |
| Peaceful | Loving, Thankful |
| Trusting | Sensitive, Intimate |
| Optimistic | Hopeful, Inspired |

## SURPRISED  (`#B19CD9`)

| Secondary | End emotions |
|---|---|
| Excited | Energetic, Eager |
| Amazed | Awe, Astonished |
| Confused | Perplexed, Disillusioned |
| Startled | Dismayed, Shocked |

## BAD  (`#88B894`)

| Secondary | End emotions |
|---|---|
| Bored | Indifferent, Apathetic |
| Busy | Pressured, Rushed |
| Stressed | Overwhelmed, Out of control |
| Tired | Sleepy, Unfocused |

## FEARFUL  (`#F0B58D`)

| Secondary | End emotions |
|---|---|
| Scared | Helpless, Frightened |
| Anxious | Overwhelmed, Worried |
| Insecure | Inadequate, Inferior |
| Weak | Worthless, Insignificant |
| Rejected | Excluded, Persecuted |
| Threatened | Nervous, Exposed |

## ANGRY  (`#E27B7B`)

| Secondary | End emotions |
|---|---|
| Let Down | Betrayed, Resentful |
| Humiliated | Disrespected, Ridiculed |
| Bitter | Indignant, Violated |
| Mad | Furious, Jealous |
| Aggressive | Provoked, Hostile |
| Frustrated | Infuriated, Annoyed |
| Distant | Withdrawn, Numb |
| Critical | Sceptical, Dismissive |

## DISGUSTED  (`#A8A8A8`)

| Secondary | End emotions |
|---|---|
| Disapproving | Judgmental, Embarrassed |
| Disappointed | Appalled, Revolted |
| Awful | Nauseated, Detestable |
| Repelled | Horrified, Hesitant |

## SAD  (`#7A9BC7`)

| Secondary | End emotions |
|---|---|
| Hurt | Embarrassed, Disappointed |
| Depressed | Inferior, Empty |
| Guilty | Remorseful, Ashamed |
| Despair | Powerless, Grief |
| Vulnerable | Fragile, Victimised |
| Lonely | Isolated, Abandoned |

---

## Counts (⚠️ chart title vs. code mismatch)

The chart is titled **"76 Emotions,"** but `lib/emotions.ts` currently defines
**82** tertiary entries (41 secondaries × 2). That's a real discrepancy to
reconcile — decide which is canonical and align the chart, `lib/emotions.ts`,
and the SQL seed to it.

- **Tertiary entries in code:** 82
- **Unique tertiary words:** 79 (3 words appear under two primaries)

## Cross-category duplicates

Three end-emotion words appear as tertiaries under two different primaries. They
are distinct entries (different `primary/secondary` path, different grape art)
and the chart disambiguates them with a nuance label:

| Word | Appears under | Chart label |
|---|---|---|
| Overwhelmed | Bad → Stressed / Fearful → Anxious | "Overwhelmed (fear nuance)" on the Fearful side |
| Embarrassed | Disgusted → Disapproving / Sad → Hurt | "Embarrassed (disgust nuance)" vs "Embarrassed (sad nuance)" |
| Inferior | Fearful → Insecure / Sad → Depressed | "Inferior (sad nuance)" on the Sad side |

Note: **Disappointed** is not a tertiary duplicate — it's a *secondary* under
Disgusted and a *tertiary* under Sad → Hurt. The chart still labels the Sad grape
"Disappointed (sad nuance)" to avoid confusion with the Disgusted heading.

---

## Editing rules

1. Change the label/word here **and** in `lib/emotions.ts` **and** in the SQL
   seed migration — all three must agree.
2. When adding or changing an end emotion, update the grape chart PNG (or note
   the intended art) so the illustration stays authoritative.
3. Keep primary colors identical to the `color` field in `lib/emotions.ts`.
4. The chart's cell numbers are decorative only — do not treat them as IDs.
