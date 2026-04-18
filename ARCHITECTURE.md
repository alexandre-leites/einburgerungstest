# ARCHITECTURE.md

## Overview

Einbürgerungstest is a vanilla-JavaScript single-page app served as static files from `docs/`. No build step, no framework, no backend. It uses hash-based routing (`#/home`, `#/mode/test`, …) and keeps runtime state in a closure on `EBT.Core.state`, persisting user data to `localStorage` under the `ebt.` prefix.

The central design principle is **strict decoupling between layout, renderers, and data**. Elements are resolved via a central registry (`selectors.js`). All chrome mutations go through a stable verb API (`view.js` — `setTitle`, `mountMain`, `openModal`, …). Markup lives in `<template>` blocks (`partials/templates.html`) that renderers clone and populate via `[data-slot]` anchors. This lets two different HTML shells — the classic sidebar layout in `index.html` and the modern dock-and-drawer layout in `modern.html` — run the same JavaScript without a single conditional branch.

A multi-pass refactor split the original 3095-line monolith into a framework (`selectors.js`, `view.js`, `templates.js`, `router.js`, `sessions.js`, `data-loader.js`, `stats-aggregations.js`) plus per-route renderers and shared helpers in `docs/scripts/modes/`. Framework modules are pure where possible and dual-compatible: they work as classic `<script>` tags in the browser and are exercised in isolation under Vitest + jsdom.

## Directory layout

```
docs/
├── index.html                       Classic layout (sidebar + topbar + footer)
├── modern.html                      Modern layout (glass header + dock + drawer)
├── sw.js                            Service worker: network-first for HTML, cache-first for assets
├── partials/
│   └── templates.html               25 <template id="tpl-..."> blocks, shared by both layouts
├── styles/
│   ├── general.css                  Base design tokens + primitives (card/pill/option/modal/…)
│   └── modern.css                   Overlay restyling the shell only (glass, dock, drawer)
├── assets/
│   ├── questions.json               ~300 questions (GERMANY + 16 state pools)
│   ├── dictionary.json              ~3000 lemmas with DE/EN/PT translations + aliases
│   └── i18n/{de,en,pt}.json         UI translation catalogues
├── scripts/
│   ├── general.js                   Init, EBT.Core assembly, remaining event wiring
│   ├── selectors.js                 Logical-name → CSS-selector registry (48 entries)
│   ├── view.js                      View verb API (chrome mutation surface)
│   ├── templates.js                 <template> clone + [data-slot] fill + partials fetch
│   ├── router.js                    Hash-based routes table and dispatcher
│   ├── storage.js                   localStorage wrapper (prefix + quota events)
│   ├── utils.js                     Pure helpers (shuffle, tokenize, formatTimeMs, …)
│   ├── validation.js                Lenient schema guards for questions + dictionary
│   ├── migrations.js                One-time localStorage migrations on version bump
│   ├── i18n.js                      Async load + t(lang, key) lookup
│   ├── stats-store.js               {correct, wrong, skipped, …} per question
│   ├── mydict-store.js              User's personal word list
│   ├── session-store.js             Per-mode session metadata
│   ├── sessions.js                  Mode session factories (pools, pickers, credit tracking)
│   ├── stats-aggregations.js        Pure aggregations over Stats + history
│   ├── data-loader.js               Fetch questions/dictionary + last-known-good fallback
│   └── modes/
│       ├── README.md                Mode file contract
│       ├── home.js                  Route: home
│       ├── memorization.js          Route: mode/memorization/random and /ordered
│       ├── training.js              Route: mode/train (weakness-weighted picker)
│       ├── test.js                  Route: mode/test (60-minute simulation)
│       ├── test-results.js          Post-test summary
│       ├── test-history-view.js     Historical test record
│       ├── review.js                Weak-questions list with "open in training"
│       ├── dictionary.js            Personal dictionary UI with import/export
│       ├── stats.js                 Per-question + per-topic aggregates
│       ├── _nav-handlers.js         Footer Back/Next registry (per-route)
│       ├── _settings.js             Language/state/focus-topic select wiring
│       ├── _question-card.js        Shared question + options renderer
│       ├── _word-ui.js              Word modal + context menu + long-press + tabs
│       ├── _keyboard-shortcuts.js   Escape + memorization arrow keys
│       ├── _test-lifecycle.js       Timer, auto-finish, stats bump, history save
│       ├── _test-review-shared.js   Title card + review table builders
│       └── _question-review-modal.js Single-question modal (populates shell)
└── tasks/                           Development notes and refactor history

tests/                               Vitest + jsdom suite (159 tests across 18 files)
data/                                Build-time question/dictionary source
scripts/                             Node scripts for content pipeline + i18n coverage
.github/workflows/ci.yml             Lint + typecheck + i18n + tests on every push
```

## Core abstractions

### `EBT.Core` (general.js)

The bundle every mode file reaches for. Owns `APP` (config constants), `state` (runtime closure), and `t` (translation helper). Wires thin shims over extracted modules so consumers have one entry point. Assembled at the top of `init()` before any extracted module runs.

Public API: `APP`, `state`, `t`, `openModal`, `closeModal`, `confirmDialog`, `openWordModal`, `renderQuestionCard`, `renderTip`, `getQuestionById`, `getQuestionMetaLine`, `getQuestionTranslation`, `getOptionTranslation`, `loadSession`, `saveSession`, `clearSession`, `ensureSessionForMode`, `ensureMemorizationSession`, `findBaseDictionaryEntry`, `setRoute`, `onRouteChange`, `readJSON`, `writeJSON`, `storageKey`, `getStatsRows`, `getStatsByTopic`, `getTestHistoryStats`, `finishTest`, `stopTestTicker`, `updateTestTimerUI`, `openQuestionReviewModal`, `getTrainCredits`, `setTrainCredits`, `bumpTrainSessionStats`, `statsBump`, `statsBumpSkip`.

### `EBT.View` (view.js)

The **only** place chrome gets mutated. Renderers and helper modules call these methods; they never touch `document` directly.

- Topbar: `setTitle(title, meta)`, `setProgress(current, total)`, `setTimer({visible?, label?, value?})`
- Footer: `setFooterState({backDisabled?, nextDisabled?, homeDisabled?})`, `setFooterVisible`
- Nav: `setActiveRoute(route)` — walks `.nav__item[data-route]`/`[data-route-prefix]` and flips `aria-current`
- Main: `mountMain(nodeOrList)`, `clearMain()`, `mainElement()`
- Modals: `openModal(id)`, `closeModal(id)`, `showConfirm(text, onOk)` — with focus-restore on close
- Toast: `showToast(message, {durationMs?})`
- Sidebar: `openSidebar`, `closeSidebar`, `toggleSidebar`, `syncSidebarForViewport` — respect `data-behavior="drawer"`
- i18n: `applyI18n(t)` — walks `[data-i18n]` / `[data-i18n-literal]`

Every method is null-tolerant: if the layout omits an optional element, the call silently no-ops.

### `EBT.Selectors` (selectors.js)

Logical-name → CSS-selector registry for 48 element IDs, grouped into `shell`, `sidebar`, `nav`, `settings`, `topbar`, `footer`, `wordModal`, `confirmModal`, `questionReviewModal`, `resetDataModal`. `query(root=document)` returns an object where every name resolves to a DOM element or `null`.

A new layout only needs to provide these 48 IDs (in whatever structural shape it likes). Omitting an optional element is safe — downstream View methods handle the `null`.

### `EBT.Templates` (templates.js)

- `clone(id)` — returns a `DocumentFragment` clone of `<template id>`.
- `fill(fragment, bindings)` — populates every `[data-slot="key"]` in the fragment. Values can be strings, `Node`s, arrays, or attribute targets via `[data-slot-attr]`.
- `render(id, bindings)` — `fill(clone(id), bindings)` in one call.
- `loadFromUrl(url)` — fetches a partial, parses its `<template>` blocks, and appends any whose IDs aren't already in the document. Awaited once during `init()` with `partials/templates.html`.

### `EBT.Sessions` (sessions.js)

Owns the per-mode session lifecycle:

- Pool builders: `getPracticeQuestions`, `getMemorizationQuestions`, `getOrderedMemorizationQuestionIds`, `getGermanyPool`
- Test picker: `pickQuestionsForTest` — reserves `APP.testWeaknessRatio` (40%) of slots for the user's weakest questions, fills the rest uniformly at random
- Session factories: `ensureSessionForMode(mode)` creates or resumes a session, applying `normalizeSchema` so renderers don't need defensive `if (!s.skipped) …` checks
- Training picker: `pickNextTrainingQuestionId` (credit-weighted with cooldowns) + `markTrainingShown`, `getTrainCredits`, `setTrainCredits`, `bumpTrainSessionStats`

### `EBT.StatsAgg` (stats-aggregations.js)

Pure aggregations over `EBT.Stats.readAll()`:

- `getStatsRows(ctx)` — `[{id, category, sub_category, correct, wrong, skipped, attempts, accuracy}]`
- `getStatsByTopic(ctx)` — rolls rows up by sub-category
- `getTestHistoryStats(readJSON, historyKey)` — summary of completed tests

### `EBT.DataLoader` (data-loader.js)

`load()` fetches `assets/questions.json` and `assets/dictionary.json` in parallel, runs them through `EBT.Validation`, indexes them onto `EBT.Core.state`, and saves a last-known-good snapshot to `localStorage`. If the network fails and no snapshot exists, it renders an error card with a retry button.

### `EBT.Router` (router.js)

Minimal hash-based router:

- `registerAll([{path, render}])` populates the routes table
- `dispatch(path)` invokes the matching renderer (falls back to home)
- `getRouteFromHash`, `setHash` for address-bar sync

### Storage / domain modules

- `EBT.Storage` — `readJSON`, `writeJSON`, quota-aware writes, dispatches `ebt:storage-write-failed` events.
- `EBT.Stats` — per-question counters (`bump`, `bumpSkip`, `readAll`, `writeAll`).
- `EBT.MyDict` — personal word list (`add`, `remove`, `has`, `readAll`, `writeAll`).
- `EBT.Session` — flat per-mode session persistence (used by `sessions.js`).
- `EBT.Utils` — pure helpers: `shuffle`, `randInt`, `tokenize`, `normalizeWord`, `canonicalWordKey`, `formatTimeMs`, `accuracyOf`, `highlightWord`, `pickWithWeaknessReservation`, `pickTrainingQuestionId`, `nextTrainingCredits`.
- `EBT.Validation` — `filterValidQuestions`, `filterValidDictionary`.
- `EBT.Migrations` — `run({currentVersion, prefix})` applies one-time data migrations.
- `EBT.I18N` — `load()` (awaited at init), `t(lang, key)`.

### `EBT.Render.<mode>` (modes/*.js)

Each mode file is an IIFE that assigns a renderer to `window.EBT.Render.<name>`. Mode files are loaded **before** `general.js` so `registerRoutes()` can wire them up. Renderers are side-effect-free until invoked; they read `EBT.Core.state`, call `EBT.View` methods, and clone templates via `EBT.Templates`.

### Supporting registries

- `EBT.Nav` (`modes/_nav-handlers.js`) — footer Back/Next dispatch. Each mode calls `register(route, {onBack?, onNext?})` or `registerPrefix(prefix, …)`.
- `EBT.Keyboard` (`modes/_keyboard-shortcuts.js`) — global Escape + memorization arrow keys, wired once via `wire()`.
- `EBT.WordUI` (`modes/_word-ui.js`) — word modal, context menu, long-press, and the DE/EN/PT definition tabs.
- `EBT.QuestionCard` (`modes/_question-card.js`) — the shared question + options renderer used by memorization / training / test.
- `EBT.TestLifecycle` (`modes/_test-lifecycle.js`) — timer, `finish(auto)`, `saveHistory`, `updateTimerUI`.
- `EBT.TestReview` (`modes/_test-review-shared.js`) — title card + review table builders reused by `test-results.js` and `test-history-view.js`.
- `EBT.QuestionReviewModal` (`modes/_question-review-modal.js`) — populates the `#questionReviewModal` shell with one question.
- `EBT.ResetData` (`modes/_reset-data.js`) — reset-modal business logic (checkbox reading, selective localStorage clearing).
- `EBT.Settings` (`modes/_settings.js`) — select-populate + change handlers + reset-button wiring.

## Boot sequence

1. HTML loads; inline stylesheet + script loader inject.
2. Framework scripts load in dependency order (`utils.js` → … → `templates.js`).
3. Mode + helper scripts load (`_question-card.js`, `_word-ui.js`, `_keyboard-shortcuts.js`, …, then the route renderers).
4. `general.js` runs `init()`:
   1. Resolves elements via `EBT.Selectors.query()` into the `els` closure.
   2. Assembles `EBT.Core` so subsequent modules can reach it.
   3. Awaits `EBT.Templates.loadFromUrl("partials/templates.html")`.
   4. Runs `EBT.Migrations.run()`.
   5. Awaits `EBT.I18N.load()`.
   6. Restores language / selected state / focus topic from `localStorage`.
   7. Awaits `EBT.DataLoader.load()` (questions + dictionary).
   8. Calls `initStatesSelect()`, `initFocusTopicSelect()`.
   9. Migrates personal-dictionary keys to canonical lowercase.
   10. Calls `initEvents()` — sidebar buttons, nav clicks, settings wire, footer Back/Next, `WordUI.wireWordInteractions()`, `Keyboard.wire()`, `hashchange`.
   11. `registerRoutes()` populates the Router table.
   12. First dispatch via `setRoute(getRouteFromHash())` → `onRouteChange()`.

Three awaits: templates, i18n, data. Each failure logs but doesn't block boot — the app degrades (empty dictionary, English key fallback, retry card).

## The `Render.<mode>` convention

```js
// modes/home.js
(function () {
  "use strict";
  window.EBT = window.EBT || {};
  window.EBT.Render = window.EBT.Render || {};
  window.EBT.Render.home = function renderHome() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const Templates = window.EBT.Templates;
    if (!Core || !View || !Templates) return;
    // ... render
  };
})();
```

`registerRoutes()` in `general.js` populates `EBT.Router.routes` with `{path, render}` pairs that delegate to `EBT.Render.<name>`. No fallbacks — every route has an implementation in `modes/`.

## View-layer contract

Methods are grouped by chrome region (topbar, footer, nav, main, modals, toast, sidebar, i18n). Every method tolerates null targets so optional chrome elements can be omitted by a layout (the modern layout has no always-visible sidebar; `View.openSidebar` still works because the drawer has `data-behavior="drawer"` which signals "slide in on every viewport").

Sidebar behaviour is controlled by an optional `data-behavior="drawer"` attribute on `#sidebar`:

- **classic** (no attribute): always-visible on desktop, overlay on mobile (`max-width: 980px`). `toggleSidebar` flips `.is-collapsed` on desktop.
- **drawer** (attribute present): always a slide-out panel regardless of viewport. `openSidebar`/`closeSidebar`/`toggleSidebar` toggle `.is-open` unconditionally; `syncSidebarForViewport` leaves the drawer state alone.

## Template contract

```html
<template id="tpl-home">
  <div class="grid">
    <div class="card">
      <div class="card__title" data-slot="introTitle"></div>
      <div class="muted" data-slot="introText"></div>
    </div>
    …
  </div>
</template>
```

```js
const frag = Templates.render("tpl-home", {
  introTitle: t("introTitle"),
  introText: t("introText"),
});
View.mountMain(frag);
```

Slot conventions:

- `<span data-slot="title"></span>` — `textContent` binding.
- `<img data-slot="hero" data-slot-attr="src" />` — attribute binding.
- A slot value can also be a `Node` / `DocumentFragment` (replaces children) or an array of nodes.
- `[data-ref="name"]` marks a node for scripts to bind behaviour to (e.g. `querySelector('[data-ref="tbody"]')`).
- `[data-action="name"]` marks interactive controls (e.g. the "view question" button in review rows).

Templates never use string concatenation; the flow is always clone → fill. Safe by construction from XSS because slot values go through `textContent` unless explicitly a Node.

## State and storage

Runtime state lives in a closure on `EBT.Core.state`:

```js
{
  questions: [],                 // validated array
  questionsById: Map,            // O(1) lookup
  baseDictionary: {},            // {lemma → {de, en, pt}}
  baseDictionaryAliases: {},     // {form → lemma}
  baseDictionaryIndex: Map,      // {canonical form → lemma}
  lang, selectedState, selectedFocusTopic,
  route, prevRoute,
  activeSession,
  testTicker,
  currentWord, currentWordDisplay,
  ignoreNextWordClick, wordLongPressTimer,
  memOrderedShouldReset,
}
```

`localStorage` keys (all prefixed `ebt.`):

- `lang`, `selectedState`, `selectedFocusTopic` — user preferences
- `statsById` — `{questionId → {correct, wrong, skipped, lastAnsweredAt}}`
- `myDictionary` — personal word list
- `session.<mode>` — per-mode session snapshot
- `testHistory` — last 50 completed tests
- `stats.sort` — current sort order on the stats page
- `ui.dismissTip.<id>` — per-mode tip dismissal
- `lkg.questions`, `lkg.dictionary` — last-known-good offline snapshots
- `migrations.v<n>` — one-shot migration flags

On load, `EBT.Sessions.loadSession(mode)` calls `normalizeSchema` so callers never see a session missing `answers`, `skipped`, `history`, `creditsById`, etc.

## Routing

Hash-based. Dispatch table:

```js
Router.registerAll([
  { path: "home",                       render: () => R.home() },
  { path: "mode/memorization/random",   render: () => R.memorization() },
  { path: "mode/memorization/ordered",  render: () => R.memorization() },
  { path: "mode/train",                 render: () => R.training() },
  { path: "mode/test",                  render: () => {
      const s = loadSession("test");
      if (s?.finished) return R.testResults();
      return R.test();
  }},
  { path: "mode/review",                render: () => R.review() },
  { path: "stats",                      render: () => R.stats() },
  { path: "test-history-view",          render: () => R.testHistoryView() },
  { path: "dictionary",                 render: () => R.dictionary() },
]);
```

`onRouteChange()` runs on `hashchange`: stops any running test timer if leaving the test route, closes the sidebar, sets `state.memOrderedShouldReset` when navigating to ordered memorization after being elsewhere, dispatches to the renderer.

Nav-handler registry (`EBT.Nav`) dispatches footer Back/Next clicks to per-route handlers. `training.js` pops from `history`; `test.js` skips the current question or calls `finishTest` on the last one; `memorization.js` registered via `registerPrefix("mode/memorization/", …)` because two routes share the handler.

## Data pipeline

Source of truth lives in `data/source/questions-raw.json` + `data/source/corrections.json`. A Node script (`scripts/update_questions.js`) applies corrections, annotates sub-categories, and emits `docs/assets/questions.json`. The dictionary is built by `scripts/fill_de_descriptions.py` from de.wiktionary.

At runtime:

1. `EBT.DataLoader.load()` fetches both JSON files in parallel.
2. `EBT.Validation.filterValidQuestions` drops malformed entries and logs them; `filterValidDictionary` does the same.
3. Questions are indexed by `_id` into a `Map`. The dictionary is indexed both by lemma (lowercase) and by alias form → lemma.
4. On success, a last-known-good snapshot is written to `localStorage`.
5. On failure, the LKG snapshot is used; if none exists, a retry card renders.

## Layout swapping

A new layout needs to satisfy this contract:

1. **48 element IDs** from `selectors.js` present in the DOM (grouped however you like).
2. **Templates** — either inline `<template id="tpl-...">` blocks or rely on `partials/templates.html` being fetched at init.
3. **`.nav__item[data-route]`** on every navigation button so `setActiveRoute` marks the current page.
4. **`[data-i18n="key"]`** on every translatable text node so `applyI18n` populates it.
5. **Optional `data-behavior="drawer"`** on `#sidebar` to signal slide-out behaviour.
6. Load the same script list as `index.html` (unchanged).

Reference: `modern.html` is the existence proof. It replaces the vertical sidebar with a bottom dock + right-side drawer, adds a glass sticky header, and reshapes the footer into a floating pill bar — without touching a single line of JavaScript. `tests/modern-layout.test.js` verifies the contract.

## Testing strategy

Vitest + jsdom. 159 tests across 18 files.

- **Pure helpers** — `utils`, `storage`, `migrations`, `validation`, `stats-store`, `mydict-store`, `session-store`, `training`, `i18n`.
- **Framework registry** — `bootstrap` (module load order and namespace population), `app-bootstrap` (every extracted module exposes the expected API), `selectors` (registry covers every ID in both layouts).
- **Behavioural** — `nav-handlers` (exact/prefix/default dispatch), `reset-data` (checkbox semantics, selective erasure), `keyboard-shortcuts` (Escape + arrows with every suppression path), `test-review-shared` (review card rows, question review modal).
- **Layout contract** — `modern-layout` (modern.html satisfies the 48-ID + nav + i18n + drawer contracts; `renderHome` executes end-to-end against the alternate DOM).

Tests inject `partials/templates.html` directly rather than going through `fetch`, so they don't need a mock HTTP server.

## Tooling

- **ESLint** + **Prettier** (configs at root).
- **tsc --noEmit** via JSDoc typedefs in `docs/scripts/types.js` and `globals.d.ts`.
- **Vitest** + jsdom (tests in `tests/`).
- **i18n coverage** — `scripts/check_i18n.mjs` verifies every `[data-i18n]` key has a translation in every language catalogue.
- **CI** — `.github/workflows/ci.yml` runs `npm run check` on every push: lint, typecheck, i18n, tests.

`npm run check` is what a contributor runs before pushing; passing locally guarantees green CI.

## Extension guide

### Adding a new mode

1. Create `docs/scripts/modes/<name>.js` that registers `EBT.Render.<name>`.
2. Add to the script list in both `index.html` and `modern.html` (before `general.js`).
3. Register the route in `registerRoutes()` in `general.js`.
4. If the mode needs back/next behaviour, call `EBT.Nav.register(route, {onBack, onNext})` from the mode file (see `memorization.js`, `test.js`).
5. Add `<template id="tpl-<name>-...">` blocks to `partials/templates.html` with `[data-slot]` / `[data-ref]` / `[data-action]` anchors.
6. Add translation keys to `assets/i18n/{de,en,pt}.json`.

### Adding a new layout

1. Create `<name>.html` with the 48 element IDs from `selectors.js`.
2. Include the same script list as `index.html`.
3. Ship a companion stylesheet (see `styles/modern.css`) or restyle in place.
4. Add a test file mirroring `tests/modern-layout.test.js` to verify the contract.

### Adding a new settings field

1. Add the HTML control in the sidebar/drawer with an `id` present in `selectors.js` (or add it to the registry).
2. In `modes/_settings.js`'s `wire()`, add a `change` listener, persist via `Core.writeJSON(Core.storageKey(…), …)`, restore on init.
3. Add i18n keys for the label.

### Adding a new translation key

1. Add the key to `assets/i18n/de.json` (source of truth).
2. Add the same key to `en.json` and `pt.json`.
3. Either use `data-i18n="key"` in HTML (picked up by `View.applyI18n`) or call `Core.t("key")` in a renderer.
4. Run `npm run check:i18n` to confirm coverage.
