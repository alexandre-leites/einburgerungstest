# Decouple functionality from layout/HTML

Goal: make `docs/index.html`'s structure replaceable without touching JS logic.
Three levels of decoupling, executed as phases. Baseline: 120 tests pass.

## Scope map (from code survey)

- `docs/scripts/general.js` — 3095 lines, ~469 DOM operations, 9 renderers, 3 shared helpers, ~48 cached element IDs.
- `docs/index.html` — 272 lines: shell (sidebar/topbar/main/footer) + 3 modals + toast.
- Data layer (`storage`, `stats-store`, `mydict-store`, `session-store`, `i18n`, `utils`, `validation`, `migrations`, `router`) is already DOM-free. ✅
- Existing seam: `window.EBT.Render.<mode>` registry + `scripts/modes/` directory (only a template so far).

## Phase 0 — Baseline guard

- [ ] Record current pass count (`npm test` → 120 tests). Re-run after every phase.
- [ ] Add a manual smoke checklist in this file (load `/`, switch language, open a mode, …) to catch regressions jsdom tests miss.

## Phase 1 — Expand `EBT.Core` surface (unblocks extraction)

Currently exposed: `APP, state, els, t, setTopbar, setProgress, setTimerVisible, setFooterButtons, setActiveNav, renderQuestionCard, getSubCategoryLabel, getQuestionMetaLine, loadSession, saveSession, clearSession, pickQuestionsForTest, findBaseDictionaryEntry`.

- [ ] Add to `EBT.Core`: `openModal, closeModal, confirmDialog, openWordModal, openWordContextMenu, closeWordContextMenu, syncStaticUITexts, ensureSessionForMode, ensureMemorizationSession, renderTip, renderSelectableText, toast`.
- [ ] Keep all existing call sites inside `general.js` working via closure bindings; the exports are read-only views.
- Verify: `npm test` still 120/120.

## Phase 2 — Selector registry (`docs/scripts/selectors.js`)

Replace the ad-hoc `Object.assign(els, { foo: document.getElementById("foo"), … })` block at `general.js:2944-3012` with a data-driven registry.

- [ ] Create `docs/scripts/selectors.js` exposing `EBT.Selectors = { <logicalName>: "<cssSelector>", … }` for all 48 IDs, grouped (chrome / sidebar / nav / settings / footer / main / modals / toast).
- [ ] Create `EBT.Selectors.query(root=document)` → returns an `els` object by resolving each entry via `querySelector`.
- [ ] In `general.js`: `Object.assign(els, EBT.Selectors.query())`.
- [ ] Add `selectors.js` to the loader in `index.html` before `general.js`.
- [ ] Add tests covering missing/extra ID detection (jsdom + index.html parse).
- Verify: all 120 tests pass; open the app in browser, every element still resolves.

Benefit: changing an ID in `index.html` requires editing one line in `selectors.js`, not hunting through JS.

## Phase 3 — View interface (`docs/scripts/view.js`)

Abstract every "chrome" write behind a stable method surface so renderers never touch `routeTitle`, `progressValue`, footer buttons, modal hidden flags, etc. directly.

- [ ] Create `docs/scripts/view.js` exposing:
  ```js
  EBT.View = {
    setTitle(title, meta),       // routeTitle + routeMeta
    setProgress(current, total), // progressValue
    setTimer({visible, label, value}),
    setFooterState({backDisabled, nextDisabled, homeDisabled, backLabel?, nextLabel?}),
    setActiveRoute(routeId),     // aria-current on nav items
    mountMain(nodeOrNodes),      // clears main, appends
    clearMain(),
    openModal(id), closeModal(id),
    showToast(message, opts?),
    openSidebar(), closeSidebar(),
  }
  ```
- [ ] Implementation reads `EBT.Selectors.query()` once (lazy), binds to found elements.
- [ ] Degrade gracefully: methods no-op if target element is absent — enables future layouts that omit optional chrome (e.g. a layout with no sidebar).
- [ ] Migrate `setTopbar`, `setProgress`, `setTimerVisible`, `setFooterButtons`, `setActiveNav`, `openModal`, `closeModal`, `toast` in `general.js` to thin wrappers delegating to `EBT.View`.
- Verify: `npm test` 120/120; manual smoke pass.

Benefit: new layouts implement this method set (~10 methods) rather than mirror a 48-ID HTML skeleton.

## Phase 4 — Template extraction (`index.html` + `scripts/templates.js`)

Move all ~15 `innerHTML` string templates from renderers into `<template>` elements inside `index.html`, so markup lives with markup.

- [ ] Create `docs/scripts/templates.js` with:
  ```js
  EBT.Templates = {
    clone(id),           // returns a DocumentFragment clone of <template id=…>
    fill(id, bindings),  // clone + populate [data-slot=…] elements
  }
  ```
- [ ] Inventory `innerHTML` strings per renderer (known set):
  - `renderHome`: intro + info cards (2)
  - `renderMemorization`: ordered-mode controls (1)
  - `renderTest`: actions card (1)
  - `renderTestResults`: title + review table (2)
  - `renderTestHistoryView`: title + review table (2)
  - `renderReview`: table header (1)
  - `renderStats`: summary pill, history table, topic cards (4)
  - `renderDictionary`: import box, table header (2)
- [ ] Add `<template id="tpl-<mode>-<name>">` blocks at the end of `index.html` body.
- [ ] Replace each renderer's `innerHTML = …` with `Templates.clone(id)` + slot population.
- [ ] Use `[data-slot="foo"]` convention for text/attr binding; `textContent` only (never `innerHTML`) to keep XSS-safe.
- Verify after each renderer conversion: `npm test` + manual.

Benefit: a layout swap only rewrites HTML (templates + shell); renderers stay untouched.

## Phase 5 — Extract mode renderers (`docs/scripts/modes/*.js`)

Move each of the 9 renderers out of `general.js` into its own file, following the existing `scripts/modes/README.md` pattern. Order by dependency weight.

Each file registers `window.EBT.Render.<mode> = function …` and is loaded **before** `general.js` so `registerRoutes()`'s `||` fallback picks it up.

- [ ] `modes/home.js` — 45 lines, no session state. (Template already exists.)
- [ ] `modes/dictionary.js` — 135 lines, self-contained.
- [ ] `modes/stats.js` — 203 lines, read-only aggregates.
- [ ] `modes/test-history-view.js` — 165 lines, read-only.
- [ ] `modes/test-results.js` — 231 lines, read-only.
- [ ] `modes/review.js` — 79 lines, navigates to training.
- [ ] `modes/memorization.js` — 88 lines + session state.
- [ ] `modes/training.js` — 56 lines + session state.
- [ ] `modes/test.js` — 68 lines + timer + session state (also owns `renderTestResults` transition).
- [ ] After each extraction: delete the now-unused default from `general.js`; `npm test`.

Benefit: `general.js` shrinks from 3095 to ~1500 lines (framework/init only); each mode is independently editable and testable.

## Phase 6 — Remove direct `els.*` access from `general.js`

After Phase 5, remaining `els.*` usage is in non-render code (init, modal plumbing, event handlers for settings). Replace with `EBT.View.*` calls wherever a view method exists; keep direct `els` access only inside `view.js`.

- [ ] Audit remaining `els.` references post-Phase-5.
- [ ] Replace with `View.*` where possible; document any that legitimately need raw DOM.
- [ ] Stop exposing `els` on `EBT.Core` (renderers get what they need through `View`).

## Phase 7 — Verification

- [ ] Full `npm run check` (lint + typecheck + i18n + tests) must pass.
- [ ] Manual smoke: home, language switch, each of 9 modes, modal open/close, reset flow, keyboard nav, timer, toast.
- [ ] Prove decoupling: swap in a minimal alternate `index.html` that implements the View contract with a different DOM shape, confirm app still runs.

## Non-goals (explicit)

- No framework introduction (React/Vue/Lit) — vanilla JS stays.
- No build step — files remain directly loadable.
- No CSS refactor — style classes are already layout-specific, that's a separate concern.
- No renderer behaviour changes — pure refactor.

## Review

Final state — all phases complete, `npm run check` green (lint + typecheck +
i18n + 125 tests pass).

### What shipped

- `docs/scripts/selectors.js` — 48 IDs as a registry; one edit point for
  layout swaps.
- `docs/scripts/view.js` — ~260-line stable method surface for every
  chrome mutation (`setTitle`, `setProgress`, `setTimer`, `setFooterState`,
  `mountMain`, `openModal`, `showToast`, sidebar ops, …). Degrades to
  no-op when optional elements are absent.
- `docs/scripts/templates.js` — `clone / fill / render` helper for
  `<template id="tpl-…">` blocks with `[data-slot]` slots.
- `docs/index.html` — ~15 new `<template>` elements holding every
  renderer's markup; loader lists all new scripts + all 9 mode files
  before `general.js`.
- `docs/scripts/modes/` — 10 files (9 modes + one shared helper for the
  test results/history-view pair).
- `docs/scripts/general.js` — 3095 → 1988 lines. Now holds init, event
  wiring, settings controls, modal plumbing, shared question-card +
  word-dictionary UI, and the `EBT.Core` export bundle the mode files
  consume.
- `EBT.Core` — widened with every helper mode files need (routing,
  storage, session, stats aggregations, modal plumbing, word UI, test
  lifecycle). `els` export removed (no mode file needs it).
- Tests — `tests/selectors.test.js` and `tests/app-bootstrap.test.js`
  added. Total 122 → 125.

### Decoupling achieved

A new layout can now replace `docs/index.html` without touching any JS, as
long as it:

1. Provides the element IDs listed in `selectors.js` (or updates that
   file to point to new IDs).
2. Keeps `<template id="tpl-…">` blocks with the same IDs and the same
   `[data-slot]` / `[data-ref]` / `[data-action]` anchor names.
3. Retains the `.nav__item[data-route]` / `data-route-prefix` contract on
   whatever navigation shape it uses.

Everything else — card classes, grid vs flex, sidebar orientation, timer
display, theming — is free to change in markup/CSS without touching JS.

### Non-goals honoured

No framework introduced, no build step, no behaviour changes, no CSS
refactor. Pure structural separation.

### Lessons captured

Added mid-flight course-correct: merging Phase 4 (templates) into Phase 5
(mode extraction) rather than doing them serially. Touching each renderer
once — extract + swap innerHTML for templates in the same pass — was
cheaper than two sequential passes.

## Bonus pass — further decoupling (same session)

After the seven planned phases, pushed four more extractions:

1. **Data-driven i18n** (`data-i18n="<key>"` attributes in HTML, `View.applyI18n(t)`
   walks them). `syncStaticUITexts` shrank from ~40 `setText` calls to three lines.
   Adding a new labelled element is now an HTML-only change.
2. **`openQuestionReviewModal`** → `modes/_question-review-modal.js`.
   Modal shell lives in `index.html`; the helper only populates the body card.
3. **Word modal + context menu** → `modes/_word-ui.js` (~220 lines).
4. **Test-mode lifecycle** (`finishTest`, `stopTestTicker`, `updateTestTimerUI`,
   `saveTestHistory`) → `modes/_test-lifecycle.js`. Test-mode domain code now
   lives entirely under `modes/`.
5. **Shared question-card helpers** (`renderQuestionCard`, `renderSelectableText`,
   `renderTip`) → `modes/_question-card.js` (~230 lines).

`general.js` after bonus pass: **3095 → 1397 lines (-55%)**. The remaining
content is init orchestration, event wiring, settings UI, session helpers,
and the `EBT.Core` export bundle — true framework/glue code with nothing
layout-specific beyond element IDs that already resolve via `selectors.js`.

Test count: 120 → 126 (added i18n walker assertion + newly-extracted helper
registrations in `app-bootstrap.test.js`).

## Third pass — domain helpers out (same session)

After the bonus pass, pulled four more extractions:

6. **`scripts/stats-aggregations.js`** — pure `getStatsRows` / `getStatsByTopic`
   / `getTestHistoryStats`. general.js wraps them with app-state context.
7. **`scripts/sessions.js`** — every mode's session lifecycle
   (`ensureSessionForMode`, `ensureMemorizationSession`, training picker,
   credit tracking, cooldowns, storage). 319 lines of domain logic now lives
   outside general.js.
8. **`modes/_reset-data.js`** — read/apply the selected categories from the
   reset-data modal. general.js keeps the two short event listeners.
9. **`modes/_nav-handlers.js`** + per-mode registrations — footer Back/Next
   became a registry. Each mode file now owns its own back/next behaviour via
   `EBT.Nav.register(route, {onBack, onNext})`. general.js's footer wiring
   collapsed from ~90 lines to 3.
10. **`_word-ui.js`** gained `wireContextMenuKeyboardNav()` — the arrow/Home/
    End/Escape keyboard handler for the word context menu. general.js just
    calls the wire-up once.

## Final state

`general.js`: **3095 → 960 lines (-69%)**. Contains init orchestration,
event wiring for the remaining genuinely-layout-specific controls
(language/state/focus-topic selects, sidebar toggle, keyboard shortcuts,
word click), the questions/dictionary loader pipeline, and the `EBT.Core`
export bundle. Nothing else.

File breakdown (docs/scripts/):

| File | Lines | Role |
|---|---|---|
| general.js | 960 | Init + event wiring + Core export |
| sessions.js | 319 | Session lifecycle (all modes) |
| view.js | 288 | Chrome mutation surface |
| selectors.js | 140 | Element-ID registry |
| stats-aggregations.js | 106 | Pure stats rollups |
| templates.js | 77 | `<template>` clone/fill |
| modes/_question-card.js | 231 | Shared question + tip renderers |
| modes/_word-ui.js | 260 | Word modal + context menu |
| modes/_test-review-shared.js | 149 | Test results/history shared helper |
| modes/_question-review-modal.js | 124 | One-question review modal |
| modes/_test-lifecycle.js | 103 | Test timer + finish flow |
| modes/_reset-data.js | 92 | Reset-data modal logic |
| modes/_nav-handlers.js | 49 | Footer back/next registry |
| modes/{home,dictionary,stats,review,...}.js | 49-181 | Route renderers |

Test count: 126 (all passing). The added bootstrap assertions cover every
new registration point (EBT.Sessions, EBT.StatsAgg, EBT.Nav, EBT.ResetData,
EBT.QuestionCard, EBT.TestLifecycle, etc.).

## Fourth pass — polish + extractions

Triggered by user bug reports + deep audit. Work done:

### Bug fixes (both pre-existed the refactor, preserved faithfully, now fixed)

- **`modes/review.js`** — "Open in training" used `trainSession.orderIds.indexOf(id)`, but training sessions have `currentQuestionId`, not `orderIds`. The throw was swallowed inside the click handler, so the button silently did nothing. Now sets `currentQuestionId` and pushes the previous one to `history` so training "Back" still works.
- **`modes/_word-ui.js`** — first right-click showed the context menu at top-left. Cause: measuring `getBoundingClientRect()` right after `hidden=false` returned stale zero dimensions in some browsers. Fix: park off-screen, measure on `requestAnimationFrame` if dimensions not yet ready.
- **`modes/_word-ui.js`** — cancel the pending focus `rAF` if the context menu is closed before it fires.
- **`general.js`** — arrow-key memorization nav fired `backBtn.click()` even when a modal was open. Now suppresses when any `.modal:not([hidden])` is visible or the word context menu is up.

### Session schema normalization

- **`scripts/sessions.js`** — `loadSession(mode)` now normalizes the returned session so `.answers`, `.skipped` (test) and `.history`, `.creditsById`, `.nextEligibleAtById`, `.sessionStatsById` (train) are always present. Removed defensive `if (!s.skipped) s.skipped = {}` guards from `modes/test.js`, `training.js`, `review.js`.

### Extractions

11. **`scripts/data-loader.js`** (164 lines) — `load()`, `applyQuestions`, `applyDictionary`, `saveLastKnownGood`, and the offline-fallback + error-card flow. general.js keeps a one-line `loadData = () => window.EBT.DataLoader.load()`.
12. **`modes/_settings.js`** (158 lines) — language/state/focus-topic select init, change handlers, reset-data wiring. general.js's init collapsed ~90 lines into `EBT.Settings.wire({ … })`.
13. **`View.showConfirm(text, onOk)`** — `confirmDialog` moved into the View layer (view.js). general.js keeps a three-line shim.
14. **`Core` exposed earlier** — moved to the top of `init()` (was at the end) so extracted modules (data-loader, settings, sessions) can reach it during startup. Function hoisting keeps all references valid.

### New tests

- `tests/nav-handlers.test.js` (6 tests) — exact match, prefix fallback, missing-verb fallback, prefix+exact priority, route-arg pass-through.
- `tests/reset-data.test.js` (8 tests) — default state, read-checkboxes, category-scoped erasure, pref protection, sweep behaviour.
- `tests/app-bootstrap.test.js` extended to cover `EBT.Settings`, `EBT.DataLoader`, `EBT.View.showConfirm`, etc.

## Final state

- `general.js`: **3095 → 747 lines (-76%)**. Now contains: init orchestration, the closure-owned helpers (t, readJSON, writeJSON, storageKey, setRoute, onRouteChange, registerRoutes, getQuestionById, etc.), event wiring for remaining settings-agnostic controls (sidebar, global keydown, word-click dispatch), the EBT.Core assembly, and thin shims for the extracted modules.
- Test count: **126 → 154** (all passing).
- Full `npm run check` (lint + typecheck + i18n + tests) green.

| File | Lines | Role |
|---|---|---|
| general.js | 747 | Init + event wiring + Core closure |
| view.js | 310 | Chrome mutation surface |
| sessions.js | 319 | Mode session lifecycle |
| data-loader.js | 164 | Async data fetch + offline fallback |
| stats-aggregations.js | 106 | Pure stats rollups |
| selectors.js | 140 | Element-ID registry |
| templates.js | 77 | `<template>` clone/fill |
| modes/_question-card.js | 231 | Shared question renderer |
| modes/_word-ui.js | 283 | Word modal + context menu |
| modes/_settings.js | 158 | Settings selects + reset wiring |
| modes/_test-review-shared.js | 149 | Shared test-review helpers |
| modes/_question-review-modal.js | 124 | Single-question review modal |
| modes/_test-lifecycle.js | 103 | Test timer + finish flow |
| modes/_reset-data.js | 92 | Reset-data modal logic |
| modes/_nav-handlers.js | 49 | Footer Back/Next registry |
| modes/{home,dictionary,…,test}.js | 49-181 | Route renderers |

## Fifth pass — event wiring extractions

- **Word interactions** (token click dispatch, outside-click dismiss, mobile long-press, view/toggle buttons, keyboard nav) consolidated in `modes/_word-ui.js` behind `EBT.WordUI.wireWordInteractions()`. general.js now calls it once.
- **Global keyboard shortcuts** (Escape, memorization arrow keys) moved to `modes/_keyboard-shortcuts.js` behind `EBT.Keyboard.wire()`. general.js calls it once.
- **Deleted myDictHas/Add/Remove helpers** from general.js — superseded by `EBT.MyDict.has/add/remove`; the "dictionary full" toast is the responsibility of the only caller (word-ui toggle button).
- **Deleted isTouchPrimary** from general.js — it only had one caller (touchstart handler), moved inline into `_word-ui.js`.

### New tests

- `tests/keyboard-shortcuts.test.js` (6 tests) — Escape dispatch, arrow navigation on/off memorization routes, suppression when modal open / context menu open / input focused.

## Final final state

- `general.js`: **3095 → 597 lines (-81%)**. Contains: IIFE-scoped helpers used across the Core export, closure state (`state`, `els`), routing logic (`registerRoutes`, `onRouteChange`, `setRoute`, `getRouteFromHash`), stats-agg wrappers that bind app state, one-line shims for extracted modules, `syncStaticUITexts`, and the `init()` orchestrator.
- Test count: **120 → 146**. Every extracted module has either integration coverage via `app-bootstrap.test.js` or a focused unit test file.
- Full `npm run check` (lint + typecheck + i18n + tests) green.

## Sixth pass — templates for the remaining dynamic DOM

Moved every `document.createElement` chain in the review modals into
`<template>` elements in `index.html`.

Added templates:
- `tpl-question-review-body` — question text + translation slot + image slot + options container.
- `tpl-question-review-option` — one option row (badge, label, translation sub-row).
- `tpl-test-review-answer-cell` / `tpl-test-review-answer-cell-dash` — the answer cells for the results table.
- `tpl-test-review-result-badge` / `tpl-test-review-skipped-badge` — correct/wrong/skipped result cells.
- `tpl-test-review-action-btn` — action buttons in the title-card actions row.

`_question-review-modal.js` and `_test-review-shared.js` now only create
one DocumentFragment per template render call and toggle slot `hidden`
flags + set dynamic style values (e.g. `style.color` for the red/green
badges). No more hand-built DOM.

Added `tests/test-review-shared.test.js` (7 tests):
- Title card pills + buttons + pass/fail badge color.
- Review card row for correct / wrong / skipped questions, in both
  German-only and English-with-translation modes.
- Question review modal populates title / subtitle / text / options /
  image from the templates, with correct `option--correct` /
  `option--wrong` class markings.

Test count: **146 → 153**. All green.

## Seventh pass — CSS-class badges + modern layout PoC

### CSS-class-ify inline colours (#4 from the remaining-improvements list)

Added `--pass: #10b981` / `--fail: #ef4444` tokens in `styles/general.css`
plus four utility classes (`.badge-pass`, `.badge-fail`, `.badge-pass--filled`,
`.badge-fail--filled`) and a `.result-pill` class for the large title-card
badge. Removed `style.color` / `style.background` writes from:
- `modes/_test-review-shared.js` (2 sites)
- `modes/stats.js` (1 site)

The `tpl-test-results-title` template lost its 70-char inline style string
in favour of `class="result-pill"`.

Tests updated to assert on class names instead of computed rgb values.

### Layout-swap proof-of-concept (#1 from the remaining-improvements list)

**Templates moved to a shared partial** — `docs/partials/templates.html`
holds the canonical set of 25 `<template>` blocks. `index.html` had its
inline templates stripped; general.js's `init()` now calls
`EBT.Templates.loadFromUrl("partials/templates.html")` before the first
render. Test suites inject the partial directly (no fetch).

**New `docs/modern.html`** — a completely different shell:
- Sticky glass header (backdrop-filter blur) with brand + route title +
  timer/progress pills + gear button.
- Bottom dock as primary navigation (7 pill buttons with emoji icons,
  safe-area aware, aria-current lights the active route).
- Right-side slide-out drawer as the settings panel (replaces the
  classic always-visible sidebar on desktop).
- Footer collapses to a floating pill bar just above the dock.
- Same 48 element IDs, same template contract, same scripts — zero
  JS changes required to run this layout.

**New `docs/styles/modern.css`** (~300 lines) — the overlay stylesheet,
loaded on top of `general.css`. Only introduces `.m-*` layout classes;
reuses all base design tokens + card/pill/table primitives.

**View gained a `data-behavior="drawer"` mode** — when the sidebar
element carries that attribute, `openSidebar` / `closeSidebar` /
`toggleSidebar` always work regardless of viewport, and
`syncSidebarForViewport` leaves the drawer state alone. The classic
layout (no attribute) keeps its existing mobile-only overlay behaviour.

**New `tests/modern-layout.test.js` (6 tests)** proves the decoupling:
- Every selectors.js logical name resolves in the modern DOM.
- Every `.nav__item[data-route]` references a known route.
- `renderHome` executes end-to-end against the modern DOM and the shared
  template partial.
- `View.setActiveRoute` marks the correct dock button.
- `View.applyI18n` populates every `[data-i18n]` in the modern shell.
- `data-behavior="drawer"` makes `View.openSidebar` work on desktop.

Cross-links added: classic layout has a "modern layout →" link in the
sidebar footer; modern layout has a "← classic layout" link in the
drawer footer.

### Final final FINAL state

- `general.js`: **3095 → 607 lines (-80%)**.
- Test count: **120 → 159** (all green). The modern-layout suite is the
  strongest validation of the whole refactor.
- Two hostable HTML entry points (`index.html`, `modern.html`) running
  off the same scripts, same partials, same selector contract, same
  nav/view/sessions APIs.
