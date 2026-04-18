# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

Einbürgerungstest is a vanilla-JavaScript static web app for studying the German naturalization test. No build step, no framework, no backend. It runs as a single page served from `docs/` and persists user data to `localStorage`.

For the full picture, read the companion documents:

- **[README.md](README.md)** — user-facing intro, how to run locally, content disclaimers.
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — module layout, `EBT.*` namespaces, boot sequence, view/template contracts, data pipeline, testing strategy, extension guide.
- **[BUSINESS.md](BUSINESS.md)** — product context, user personas, feature map, content pipeline, explicit non-goals.
- **[DESIGN.md](DESIGN.md)** — design tokens, component primitives, layout systems, accessibility patterns, iconography choices.

Read **ARCHITECTURE.md first** before touching any code — the module graph is non-obvious.

## Repository shape at a glance

```
docs/                     Served as static files (GitHub Pages)
├── index.html            Classic layout (sidebar + topbar + footer)
├── modern.html           Modern layout (glass header + bottom dock + drawer)
├── partials/             Shared <template> blocks (fetched at init)
├── styles/               general.css + modern.css
├── assets/               Questions, dictionary, i18n catalogues
└── scripts/
    ├── general.js        Init + EBT.Core assembly
    ├── {view,selectors,templates,router,sessions,…}.js   Framework modules
    └── modes/            Per-route renderers + shared helpers

data/                     Build-time question/dictionary source
scripts/                  Node scripts for data pipeline + i18n coverage
tests/                    Vitest + jsdom suite (159 tests)
.github/workflows/ci.yml  Lint + typecheck + i18n + tests
```

## Critical operating rules

### 1. Decoupling is load-bearing — do not break it

The project just went through a multi-pass refactor to separate layout, renderers, and data. Respect the boundaries:

- **Mode files (`docs/scripts/modes/*.js`) must not call `document.getElementById` or touch a global `els` cache.** Go through `EBT.View` for chrome mutations and `EBT.Templates.render(id, bindings)` for new DOM. If you need an element that `View` doesn't expose, add a method to `view.js` rather than reaching into `document`.
- **Element IDs live in one place** — `docs/scripts/selectors.js`. Never hard-code IDs in renderers; resolve via `EBT.Selectors.query()` (already done by View).
- **Markup lives in `docs/partials/templates.html`.** No `innerHTML` string concatenation inside JS. Add a `<template>` block and use `[data-slot]` / `[data-ref]` / `[data-action]` anchors.
- **State lives on `EBT.Core.state`.** Don't invent new globals.
- **Both layouts (`index.html`, `modern.html`) must stay in lockstep.** If you add a new element ID, template, or script to one, add it to the other. `tests/modern-layout.test.js` will fail otherwise.

### 2. Always run `npm run check` before considering work done

```bash
npm run check   # lint + typecheck + i18n coverage + 159 tests
```

All four steps must pass. CI runs the same command; green locally = green in CI.

Individual steps:

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit via JSDoc
npm run check:i18n  # every [data-i18n] key resolves in de/en/pt
npm test            # Vitest + jsdom
```

### 3. Translations must stay in sync across DE/EN/PT

Any new translatable string requires keys in all three of `docs/assets/i18n/{de,en,pt}.json`. `npm run check:i18n` verifies coverage. **DE is the source of truth** — translate from DE to EN/PT, not the reverse. EN/PT translations are acknowledged as unverified in the README; do not regenerate them en-masse.

### 4. Content (questions, dictionary) is generated, not edited directly

`docs/assets/questions.json` and `docs/assets/dictionary.json` are **build artefacts**. Edit the sources under `data/source/` and rebuild via `./scripts/build-data.sh`. See `data/README.md`.

### 5. Never regress the decoupling contract

When adding a feature, ask:

- Does this renderer touch `document` directly? → Go through View.
- Does this component have hard-coded HTML strings? → Extract to a template.
- Does this code reach into private state of another module? → Use the public API, or expose a method.
- Does this feature require editing both `index.html` and `modern.html`? → Yes if you add element IDs or change the script list. No if it only affects what renderers produce (that flows through templates automatically).

### 6. Service worker has a version

`docs/sw.js` has a `CACHE_VERSION` constant. Bump it on releases that change the script manifest, template contract, or selector registry — otherwise users may get served a stale HTML shell against new scripts.

HTML navigations use network-first (so `CACHE_VERSION` bumps aren't strictly required for HTML); assets use stale-while-revalidate. Bump anyway when in doubt.

### 7. Do not delete `docs/.nojekyll`

GitHub Pages runs Jekyll by default, and Jekyll silently **ignores every file or directory whose name starts with `_`**. That would drop all our shared helpers (`docs/scripts/modes/_nav-handlers.js`, `_settings.js`, `_question-card.js`, …) from the deployed site and the app would 404-cascade on load.

The empty `docs/.nojekyll` file disables Jekyll. Keep it. Similarly, if you rename or add new underscore-prefixed files, no extra action is needed — they'll be served because of `.nojekyll`. If you ever see a "works locally, fails on GitHub Pages" report mentioning an `_` file, check that `.nojekyll` is still there.

## Working with the codebase

### Finding things

- **What a mode does**: `docs/scripts/modes/<name>.js` + its template block(s) in `partials/templates.html`.
- **Where an element is defined**: grep for its `id=` in `index.html`, then check `docs/scripts/selectors.js` for the logical-name mapping.
- **Where a string comes from**: grep for the English text in `docs/assets/i18n/en.json`, then grep for the key.
- **Where a setting is persisted**: grep `storageKey("…")` in `docs/scripts/modes/_settings.js`.
- **Where a route handler lives**: `registerRoutes()` in `docs/scripts/general.js`, plus `EBT.Render.<mode>` in the matching mode file.

### Adding features

See the **Extension guide** section at the bottom of [ARCHITECTURE.md](ARCHITECTURE.md) for step-by-step recipes:

- Adding a new mode
- Adding a new layout
- Adding a new settings field
- Adding a new translation key

### Debugging runtime issues

1. **Check `localStorage` under the `ebt.` prefix** — every user-data issue eventually traces back to a cached session, stats, or last-known-good snapshot. The reset-data modal is the escape hatch.
2. **Check the service worker** — DevTools → Application → Service Workers. If the app seems stuck on an old version, unregister and reload.
3. **Check `EBT.Core.state`** in the console for runtime state.
4. **Check the network tab** — `questions.json` and `dictionary.json` must load; `partials/templates.html` must load before the first render.
5. **Check the console for validation warnings** — `EBT.Validation` logs dropped questions/dictionary entries.

## Do not

- **Do not introduce a framework** (React, Vue, Svelte, …). The decoupling above was the price paid for going frameworkless; don't undo it.
- **Do not add a build step** without a clear reason. Everything works as-shipped; a build step forces deploy complexity on an app that's currently one `cp -r docs/ /var/www/` away from working.
- **Do not add telemetry, analytics, or external network calls.** This is a personal-use app with explicit no-backend constraints (see BUSINESS.md).
- **Do not commit changes without being asked.** The author's workflow reviews each change manually. Implement, report, wait for `commit` instruction.
- **Do not touch `docs/assets/questions.json` or `docs/assets/dictionary.json` by hand.** Edit `data/source/` and rebuild.
- **Do not add emoji or decorative characters** to source files unless the user explicitly asks. The existing README uses some; match its level, don't escalate.
- **Do not regenerate i18n files wholesale.** EN/PT are pragmatically machine-translated; only edit keys you're changing.

## When asked to refactor / clean up / improve

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) first. Many "improvements" would regress the decoupling.
2. Check `docs/tasks/todo.md` — it contains the full refactor history and often notes what was deliberately left alone.
3. Run `npm run check` before starting to establish the baseline.
4. Prefer **deletion** over addition; the app has been through several extraction passes and has very little dead code left. If you're tempted to add a helper, first check whether an existing one in `EBT.Utils` / `EBT.View` / `EBT.Sessions` already does it.
5. If adding new abstraction, add behavioural tests under `tests/` (see existing patterns in `tests/nav-handlers.test.js`, `tests/reset-data.test.js`, `tests/keyboard-shortcuts.test.js`, `tests/test-review-shared.test.js`).
6. After changes, re-run `npm run check`. All 159 tests must still pass (plus any new ones you wrote).

## When asked "what's next" or "anything to improve"

The author explicitly does not want extraction-for-extraction's-sake. Before proposing changes, honestly weigh:

- **Signal over noise**: what user-visible or developer-velocity benefit does this unlock?
- **Reversibility**: is the change local to one file, or does it ripple?
- **Risk**: does it cross a decoupling boundary that's currently clean?

Genuine improvement directions (listed in `docs/tasks/todo.md` and the late messages of the refactor history):

- Dictionary renderer test coverage (missing).
- JSDoc type annotations for the extracted modules (partial).
- Accessibility audit (focus management, aria-live, keyboard-trap risks).

Explicitly **not** worth doing:

- Further splitting `general.js` — remaining content is init orchestration + closure-bound helpers.
- Introducing a framework.
- Adding a build step.
- Standardising cosmetic style differences between modules.
