# Mode renderers

Each mode is a self-contained file that registers `window.EBT.Render.<mode>`
and is loaded *before* `scripts/general.js`. `registerRoutes()` in
`general.js` uses `R.<mode> = R.<mode> || <default>` so external files
always win — but now that every default has been extracted, `general.js`
registers no fallbacks and only the files in this directory own rendering.

## Anatomy of a mode file

```js
(function () {
  "use strict";
  window.EBT = window.EBT || {};
  window.EBT.Render = window.EBT.Render || {};

  window.EBT.Render.home = function renderHome() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const Templates = window.EBT.Templates;
    if (!Core || !View || !Templates) return;

    const t = Core.t;

    View.setActiveRoute("home");
    View.setTitle(t("home"), "");
    View.setTimer({ visible: false });
    View.setFooterVisible(false);
    View.setProgress(0, 0);

    const frag = Templates.render("tpl-home", { /* slots */ });
    View.mountMain(frag);
    View.setFooterState({ backDisabled: true, nextDisabled: true });
  };
})();
```

Register in `docs/index.html`'s script list before `scripts/general.js`.

## What a mode file may reach for

| Symbol               | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `EBT.Core.state`     | App state (questions, lang, activeSession, …)    |
| `EBT.Core.APP`       | Config constants (testTotal, focusTopicAll, …)   |
| `EBT.Core.t(id)`     | Translate helper                                 |
| `EBT.Core.*`         | Session, question lookup, stats, word UI helpers |
| `EBT.View.*`         | Every chrome/layout mutation (no raw DOM)        |
| `EBT.Templates.*`    | `clone`, `fill`, `render` for `<template>` nodes |
| `EBT.Utils.*`        | Pure helpers (shuffle, nextTrainingCredits, …)   |
| `EBT.Stats`, `EBT.MyDict`, `EBT.Session`, `EBT.Router` | Persistent data layers |

A mode file **must not** touch `document.getElementById` or read from a
global `els` cache — those are the View layer's job.

## Separation of concerns

- **`selectors.js`** — logical-name → CSS selector registry.
- **`view.js`** — stable verb API over the layout (`setTitle`, `mountMain`,
  `openModal`, …). Degrades gracefully when optional chrome is absent.
- **`templates.js`** — helper for cloning `<template>` fragments with
  `[data-slot]` populated.
- **`modes/*.js`** — per-route renderers. Side-effect-free until the route
  dispatches.
- **`general.js`** — init, event wiring, settings, modal plumbing, shared
  question card / word dictionary UI. Owns the `EBT.Core` object that
  mode files consume.

## Adding a new mode

1. Add routes to `router.js` (or `registerRoutes()` in `general.js`).
2. Create `modes/<name>.js` that registers `EBT.Render.<name>`.
3. Add any templates it needs inside `index.html` as `<template id="tpl-...">`.
4. Add the file to the loader in `index.html` before `general.js`.
