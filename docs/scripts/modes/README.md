# Mode renderers

The router (`scripts/router.js`) looks up renderers by name on
`window.EBT.Render.<mode>`. `scripts/general.js` installs default
implementations for every mode via `registerRoutes()`, but any file loaded
*before* `general.js` can override a mode by assigning a function onto
`window.EBT.Render`. This is the seam used to move render functions out of
the monolithic `general.js` one at a time.

## Adding or replacing a mode

1. Create a new file here (e.g. `modes/home.js`).
2. Register your implementation as the first thing it does:
   ```js
   (function () {
     "use strict";
     window.EBT = window.EBT || {};
     window.EBT.Render = window.EBT.Render || {};
     window.EBT.Render.home = function renderHome() {
       // ... render into EBT.Core.els.main using EBT.Core.state / EBT.Core.t / ...
     };
   })();
   ```
3. Add it to `docs/index.html`'s script list *before* `scripts/general.js`.

`registerRoutes()` uses `R.home = R.home || renderHome` — so any override you
set from a mode file wins over the default in `general.js`.

## What a mode file needs from the app core

Most renderers reach into:

| Symbol                        | What it is                                              |
| ----------------------------- | ------------------------------------------------------- |
| `EBT.Core.state`              | App state (questions, lang, activeSession, etc.)        |
| `EBT.Core.els`                | DOM element cache (`main`, `routeTitle`, ...)           |
| `EBT.Core.t`                  | Translate helper (`EBT.Core.t("home")`)                 |
| `EBT.Core.setTopbar`          | Update topbar title + meta                              |
| `EBT.Core.setFooterButtons`   | Toggle back/home/next state                             |
| `EBT.Core.renderQuestionCard` | Shared question renderer                                |
| `EBT.Stats` / `EBT.Session`   | Persistent data layers                                  |
| `EBT.Utils`                   | Pure helpers (shuffle, weaknessKeyFor, highlightWord…)  |

`EBT.Core` is the last surface still coupled to the closure inside
`general.js`. When you're ready to split a given mode, add the symbols it
needs to `EBT.Core` from within `general.js` (alongside the existing
`Router`/`Render` wiring) and the mode file will pick them up.

## Split priority

The easiest renderers to extract first are the ones with the fewest
cross-file dependencies:

1. `renderHome` — just text + tiles.
2. `renderDictionary` — already mostly self-contained.
3. `renderStats` / `renderTestHistoryView` — read-only aggregates.
4. `renderMemorization` / `renderTraining` / `renderTest` — state-heavy;
   leave for last.
