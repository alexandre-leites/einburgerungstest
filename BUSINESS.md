# BUSINESS.md

Product context for a non-technical reader. For implementation details see [ARCHITECTURE.md](ARCHITECTURE.md); for design/UI patterns see [DESIGN.md](DESIGN.md).

## What this is

A free, open-source study companion for the German citizenship test (Einbürgerungstest), built by the author (a Brazilian software engineer living in Germany) to help himself prepare. It runs entirely in the browser — no account, no backend, no telemetry — and is deliberately shipped with a "personal project" framing: the README makes it clear that translations and dictionary entries were machine-generated and not professionally verified, and that the code was "vibe coded" for personal use rather than production rigour.

Users open the site, pick a study mode (memorise, train, simulate the exam, review their weak spots), and their progress is persisted locally between visits. A personal dictionary grows as the user taps on German words they want to study.

## The Einbürgerungstest (background)

The Einbürgerungstest is Germany's naturalisation exam, administered by the Federal Office for Migration and Refugees (BAMF). The full question catalogue has **300 national (Germany-wide) questions plus 10 per Bundesland** (Germany's 16 federal states). Each applicant sits **33 questions in 60 minutes**: 30 from the national pool and 3 specific to the Bundesland where they live. The pass mark is **17 correct answers** (≈ 52%). Questions are multiple-choice with exactly four options and one correct answer. The official test catalogue is published and freely available.

Several product decisions in this app are direct reflections of that structure:

- **Per-state question pool**: the app lets the user pick their Bundesland (Berlin is the default). Test simulations always include 30 Germany-wide questions + 3 from the selected state, and the state-specific pool follows the user when they change the setting. Changing the state mid-session resets in-flight sessions because the question set changes.
- **Test timer of 60 minutes**: `APP.testDurationMs = 60 * 60 * 1000` and `APP.testTotal = 33` are hard-coded to match the real exam. Time-out triggers auto-submit.
- **33-question simulations, 17 to pass**: the results screen shows a green "Pass" pill for ≥17 correct and red "Fail" below, matching BAMF's threshold.
- **Sub-category filter**: the real catalogue groups questions thematically (fundamental rights, political system, state administration, history, society/welfare, Europe). The app exposes this as a "focus topic" filter so a user who knows they're weak on history, say, can practise just that slice.
- **Images in questions**: a minority of questions reference images (e.g. flags, the Federal Eagle). They're included in `docs/images/` and rendered inline.

## Users

### 1. The primary user — someone preparing for the test

A resident of Germany (typically non-native, often with German as a second language) who needs to pass the Einbürgerungstest as part of their naturalisation process. They have a few weeks or months to prepare and need a way to:

- **Familiarise with all 310 potentially-relevant questions** (300 national + 10 for their state).
- **Simulate the real exam** under realistic conditions (timer, mixed question set, pass/fail feedback).
- **Focus on weak spots** so they don't waste time re-studying questions they already know.
- **Understand the questions in their own language** because the German is often administrative or legalistic.

The main user leans on **Memorization** (to read everything at least once with the answers visible), **Training** (which weighs weak questions higher), **Test** (full simulation), and **Review** (surfaces their weakest 30 questions with a "jump into training" shortcut).

### 2. The German learner — someone using the questions to build vocabulary

A secondary user who may or may not be taking the test, but wants structured German reading practice. The app's **word click → context menu → dictionary modal** pattern turns every question into a vocabulary drill: click any word in the question or options, see its base-dictionary entry with translation and example phrases, and optionally add it to the **My Dictionary** list for later review.

This user leans on **any question-displaying mode** as a reading experience, the **Dictionary** tab to browse and export their accumulated vocabulary, and the **language toggle** (DE/EN/PT) to compare translations side-by-side.

### 3. The project author — studying for his own test

Explicit from the README: the author built this to help himself prepare for his own Einbürgerungstest. That framing is load-bearing — it explains why Portuguese (the author's native language) is one of the three UI languages alongside the expected German and English; why the content ships with acknowledged imperfections rather than waiting for professional translation review; why there's no account system or analytics; and why the code was iterated on pragmatically. The "modern layout" (`modern.html`) was added as an architectural proof-of-concept rather than for user demand.

## Feature map

### Home
A static landing card with an intro and a short explainer of each mode and the test rules. No progress, no calls to action. It doubles as a safe default route when the hash is invalid.

### Memorization — random / ordered
Display one question at a time with **the correct answer already marked**. No quiz pressure: the user can read, re-read, click words to look them up, and navigate prev/next with the footer buttons or arrow keys. Ordered mode sorts questions by numeric ID (useful for mapping back to printed materials); random mode shuffles. A "jump to question ID" control lets power users skip to a specific question. This is the first-pass study mode.

### Training
Shows one question at a time and waits for the user to choose an option. Immediate feedback (green for the correct option, red for the chosen wrong one). Under the hood, the **question picker is weakness-weighted**:

- Each question has a "credit" score, defaulting to `APP.trainDefaultCredits = 10`.
- Getting a question right **reduces** its credits (the picker will show it less often); getting it wrong **increases** them.
- Once a question is shown, it's on a **cooldown** (random between 3 and 10 minutes) so the user doesn't see the same question back-to-back.
- Skipping a question (clicking Next without answering) is tracked as a skip and bumps the skipped counter in stats.

This matches a loose spaced-repetition model: questions you answer reliably drift out of the rotation; questions you struggle with come back.

### Test
A full 33-question, 60-minute simulation. The question set is picked at session start using `EBT.Sessions.pickQuestionsForTest`, which:

- Reserves **40%** of slots (`APP.testWeaknessRatio = 0.4`) for the user's **weakest questions** (lowest correct count, then lowest total views).
- Fills the remaining 60% uniformly at random from the pool.
- Mixes 30 national questions with 3 from the selected state.

The weakness reservation is a deliberate design choice: a purely-random sample wastes time on questions the user already nails. A purely-weakness sample would be an echo chamber. The 40/60 split surfaces weaknesses while keeping the test varied.

The timer ticks visibly; answers are saved on every selection so a refresh mid-test restores the session. Finishing (manual or auto on time-out) writes a record to `testHistory` for the Stats page.

### Test results
Post-test summary: green/red pass badge, correct/wrong/accuracy pills, and a full review table with every question's chosen vs. correct answer. Each row has a "view" button that opens the single-question review modal (full text, image if any, options highlighted). From here the user can start a **new test** or go to **Stats**.

### Test history
A stored record of the last 50 completed tests, each clickable to re-open its results view. Accessed from Stats.

### Review
The user's top-30 weakest questions (most wrong, then lowest accuracy), in a sortable table. Each row has an "open in training" button that points the Training session's `currentQuestionId` at that question — so a single click takes you from "I know I'm weak on question 42" to "now I'm looking at question 42 in training mode with feedback".

### Dictionary (personal)
The running list of words the user has tapped and chosen to save. Supports **import/export** as JSON so a user can back up their vocabulary or share it between browsers. The export is copied to the clipboard; import accepts either the app's own format or older versions (key normalisation is applied).

The dictionary is capped (see `EBT.MyDict.MAX_ENTRIES`); older entries drop off silently if the cap is reached, with a "dictionary full" toast when it first happens.

### Stats
Three sections:

1. **Test history summary** — total tests, average score, pass rate, plus a table of the last 10 tests with a "view" button per row.
2. **Per-topic aggregates** — correct / wrong / accuracy grouped by sub-category (so the user sees "I'm strong on history but weak on EU"). The "state" questions are bucketed separately.
3. **Per-question rows** — every question the user has ever answered, sortable by most-wrong / most-correct / most-skipped / best-accuracy / worst-accuracy. Accuracy is computed from `correct / (correct + wrong)`.

No charts; just tables. The sort preference is persisted.

## Personalization and multi-language

- **Three UI languages**: German (`de`) as the source of truth, plus English (`en`) and Portuguese-Brazil (`pt`). The language toggle affects **every** UI string plus adds a translation subtitle under each question and option when a non-German language is active. The README notes translations are machine-generated and unverified.
- **16 Bundesland options** populated from the question data at runtime — the app inspects which non-`GERMANY` categories appear in `questions.json` and offers them as state choices. Berlin is the default first-visit state.
- **Focus-topic filter**: `ALL` plus the six sub-category keys (`FUNDAMENTAL_RIGHTS`, `POLITICAL_SYSTEM`, `STATE_ADMIN`, `HISTORY`, `SOCIETY_WELFARE`, `EUROPE`). When set, practice modes filter the national pool to just that topic.
- **Personal dictionary** — user-built vocabulary with timestamps; exports to clipboard, imports from JSON.
- **Stats tracking** — per-question and per-topic, persisted forever (until the user hits Reset Data).
- **Reset Data** modal — granular, lets the user wipe stats / sessions / dictionary / "other local settings" / language / state / focus topic independently. "Other" is a catch-all for anything under the `ebt.` prefix the explicit checkboxes don't cover.

## Content pipeline

Questions and dictionary are **generated artefacts**, not hand-edited files. See [`data/README.md`](data/README.md) for the full story. Summary:

```
data/source/questions-raw.json   ← baseline question set
data/source/corrections.json     ← sub_category overrides, wording fixes
         │
         │ node scripts/update_questions.js
         ▼
docs/assets/questions.json       ← served at runtime
```

```
docs/assets/dictionary.json (seed)
         │
         │ python3 scripts/fill_de_descriptions.py  (slow, network-bound)
         ▼                                          (fetches de.wiktionary definitions)
docs/assets/dictionary.json      ← served at runtime
```

Both outputs are served straight from `docs/assets/`; there is no CDN layer, no build step at deploy time, and no server-side transform. The whole site is static.

## Constraints and non-goals

Pulled verbatim from the README and affirmed here as hard limits:

- **Personal project**, built pragmatically for the author's own studying. No warranty.
- **Translations are unverified.** EN/PT were machine-translated; they may be subtly wrong. Do not edit them wholesale — change only keys you're intentionally fixing.
- **Dictionary entries are unverified.** About 1500 of the 1951 entries still have their DE `description` field as the lemma itself (a placeholder). The UI hides that and falls back to EN/PT tabs.
- **Images may be subject to third-party copyright.** Included for personal-study use only. No ownership claimed.
- **Not affiliated with BAMF or the German government.** The official source is [bamf.de](https://www.bamf.de).
- **No backend.** Everything runs in the browser. `localStorage` for persistence, `fetch` for static JSON assets, nothing else.
- **No accounts, no telemetry, no analytics.** A new device starts fresh. Users who want cross-device sync must export their dictionary by hand.
- **No feature gating by payment.** It's free, open source, and intended to stay that way.

## Success criteria (implicit)

Since the app has no analytics, "success" is behavioural — the experience must satisfy these invariants for the primary persona:

1. **Test simulations faithful to the real exam** — 33 questions (30 national + 3 state), 60 min timer, pass at ≥17.
2. **Progress survives reloads** — any session mid-flight can be refreshed without data loss; completed tests appear in history.
3. **Weak questions resurface** — the user's mistakes are over-weighted in both training (credit system) and test (40% reservation).
4. **Reading in non-German is comfortable** — the translation toggle exposes EN/PT subtitles on every question and option.
5. **The app boots offline** — the service worker caches assets; `localStorage` holds a last-known-good snapshot of questions and dictionary; the app works without a network on repeat visits.

## Competitive landscape

There are other study tools:

- **BAMF's own app** — the official source, free on iOS/Android.
- **"Leben in Deutschland"** and various other integration-course apps.
- **Paid quiz apps** (various quality).
- **Print study guides** sold at German bookstores.

This project's differentiators:

- **Free + open source** (MIT-style; see LICENSE).
- **Multilingual with Portuguese-Brazil** — rare among existing tools; reflects the Brazilian author's origin.
- **Personal dictionary feature** — building a vocabulary list alongside test prep is not a standard feature in the category.
- **Works offline after first load** — no lock-in to an app store.
- **Zero privacy cost** — no tracking, no account, no network after initial asset load.
- **Open-source extensibility** — the layout-swap refactor (documented in ARCHITECTURE.md) makes it easy to fork and reskin for another jurisdiction's similar test (if anyone ever cares).

## Future directions (speculative)

These would be natural evolutions given the current shape but are **not** committed work:

- **More languages** — Turkish, Arabic, Russian would be high-value additions given the German migrant demographics. The i18n infrastructure is already ready; adding a language is four changes (a new JSON file, one entry in the language-select, one default-language branch if needed, and the i18n coverage check).
- **Spaced-repetition in Training** — credits + cooldowns are a rough approximation. A real SM-2 or FSRS scheduler would be more effective.
- **Audio pronunciation** — tap a word to hear it spoken. Could use browser speech-synthesis, no bandwidth cost.
- **User accounts / cross-device sync** — would require a backend; explicitly out of scope today.
- **Question-level rationales** — "why is option 3 correct?" with a short paragraph. Would require content writing, not code.
- **Alternate jurisdictions** — the decoupled architecture means the app could, in principle, be forked for Austria's naturalisation test, Switzerland's, etc. No content overlap but same UI shape.

None of these are on the roadmap; the app is complete for its primary use.
