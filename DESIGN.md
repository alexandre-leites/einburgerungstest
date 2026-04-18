# DESIGN.md

Visual language and UX patterns. For module boundaries see [ARCHITECTURE.md](ARCHITECTURE.md); for the product context see [BUSINESS.md](BUSINESS.md).

## Design philosophy

Dark-first, calm, and markup-driven. The app keeps the chrome quiet (translucent panels over a blue-navy background, subtle focus rings, minimal animation) so the content — question text, options, tables — stays in the foreground. All interactive surfaces are touch-friendly (≥40px hit targets, ≥10px padding), keyboard-navigable (explicit `:focus` rings on every control), and accessible by default (`role` / `aria-*` attributes on modals, tabs, menus, toasts, and the skip link).

The design system is a small vocabulary of primitives — **card, pill, option, row, stack, grid, field, btn, table, modal, tabs, toast, context-menu, word, badge** — that renderers compose. Every template in `docs/partials/templates.html` is built from these classes. A new screen is never a bespoke layout; it's a new combination of existing primitives, which is why the modern layout (`modern.html`) can reshape the shell without changing any content-side CSS.

## Design tokens

Defined at the top of `docs/styles/general.css`:

| Token | Value | Purpose |
|---|---|---|
| `--bg` | `#070d1a` | Page background (deep navy) |
| `--panel` | `#0b1327` | Solid panel / modal body |
| `--panel-2` | `#0f1b33` | Slightly lighter panel tint (select popups) |
| `--text` | `#f8fafc` | Primary foreground |
| `--muted` | `rgba(248,250,252,0.72)` | Secondary text (subtitles, labels, meta) |
| `--border` | `rgba(248,250,252,0.14)` | Standard panel / row border |
| `--shadow` | `0 14px 36px rgba(0,0,0,0.45)` | Elevated surfaces (cards, modals) |
| `--primary` | `#7dd3fc` | Accent (focus rings, primary-button tint, pass-hint glow) |
| `--good` | `#22c55e` | Green — option--correct tint (the quiz "correct" highlight) |
| `--bad` | `#ef4444` | Red — option--wrong tint (the quiz "wrong" highlight) |
| `--warn` | `#f59e0b` | Amber — reserved, currently unused |
| `--pass` | `#10b981` | Emerald — pass badge (test-results title card, inline stats row) |
| `--fail` | `#ef4444` | Red — fail badge (identical visual weight to --bad, distinct tokens for test-review vs. option states) |
| `--focus` | `rgba(125,211,252,0.55)` | Focus outline colour (translucent primary) |
| `--radius` | `14px` | Standard rounded-corner |
| `--radius-sm` | `10px` | Tighter rounded-corner (chips, small buttons) |
| `--sidebar-w` | `292px` | Classic sidebar width (desktop) |
| `--max` | `1100px` | Main content max-width |
| `--font` | `ui-sans-serif, system-ui, …` | Body text (system stack, OS-native) |
| `--mono` | `ui-monospace, SFMono-Regular, …` | Monospace (numbers, IDs, timers, codes) |

`--pass` and `--fail` were added after the initial set to disambiguate badge colours from the option quiz-state colours. `--good`/`--bad` tint option backgrounds (low-alpha); `--pass`/`--fail` colour result-card pills (solid). Keeping them separate means changing the quiz-feedback tone doesn't ripple into the test-results badge.

The modern layout (`styles/modern.css`) adds its own set of layout-specific tokens (`--m-header-h`, `--m-dock-h`, `--m-drawer-w`, `--m-glass`, `--m-accent-grad`) and reuses every base token above — it never overrides colour/radius tokens, only the chrome geometry.

## Typography

Pure system stack. No custom font loading, no webfont CSS, no FOUT/FOIT to worry about:

```css
--font: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
        Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
--mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        "Liberation Mono", "Courier New", monospace;
```

The `--mono` stack is used for **tabular numbers** via a `.mono` utility class: timers, progress counters (`0/33`), question IDs (`frage-42`), stats columns (attempts / correct / wrong / accuracy). It guarantees column alignment in tables and stable width in the topbar timer as seconds tick.

There are four typographic weights in use:

- **400** — body (inherited from system sans).
- **600** — result pills (the big green/red pass/fail).
- **700** — card subtitles and button labels.
- **800 / 900** — card titles and modal titles (deliberately heavy to anchor the eye).

Emoji are font-glyphs (via the Apple/Segoe emoji fallbacks in `--font`). They render consistently across platforms and cost nothing; see **Iconography** below.

## Colour system

Dark-first (`color-scheme: dark` at `:root`), with a subtle radial-gradient body background:

```css
body {
  background:
    radial-gradient(1200px 600px at 20% -10%, rgba(125,211,252,0.18), transparent),
    radial-gradient(900px 500px at 90% 0%,  rgba(34,197,94,0.10),  transparent),
    var(--bg);
  background-attachment: fixed;
}
```

The two radial gradients add a hint of cyan (top-left) and green (top-right) tint to the otherwise flat navy. Subtle enough to read as "dark theme with character", not enough to read as "gradient page".

**Functional colours** are split into two roles:

- **Quiz feedback (option tints):** `--good` / `--bad` — used as low-alpha backgrounds and borders on `.option--correct` / `.option--wrong`. E.g. `background: rgba(34,197,94,0.12)` — barely tinted so the text stays readable.
- **Result indicators (badges):** `--pass` / `--fail` — used as solid backgrounds (`result-pill`) or foreground text (`badge-pass` / `badge-fail`).

**Translucency conventions:**

- `rgba(248,250,252,0.08)` — default button / option background (8% white over dark).
- `rgba(248,250,252,0.14)` — standard 1px border on panels, rows, select fields.
- `rgba(125,211,252,0.22)` — primary button background tint.
- `rgba(0,0,0,0.26)` — card inner background (darker than panel).
- `rgba(0,0,0,0.60)` — modal backdrop.

Opacity-first layering means the same primitives read correctly over any background — a card inside a sidebar, in main content, or inside a modal all look consistent because the `rgba(0,0,0,…)` works everywhere.

## Components

Every example below is from `docs/partials/templates.html` or `docs/index.html`. Class names follow BEM-ish conventions: `block`, `block__element`, `block--modifier`.

### Card

```html
<div class="card">
  <div class="card__title">Heading</div>
  <div class="muted">Secondary body text</div>
</div>
```

Rounded 14px container with a subtle `rgba(0,0,0,0.26)` inner background and `--shadow` elevation. Every mode's content is composed of cards. `.card__title` is a heavy (`font-weight: 900`) heading with 8px bottom margin. Nested cards with `style="box-shadow:none"` are used for sub-sections (e.g. the dictionary import/export sub-card).

### Pill

```html
<div class="pill">
  <span class="pill__label">Progress</span>
  <span class="pill__value mono">17/33</span>
</div>
```

Compact label/value pair used in the topbar (timer, progress) and in the test-results summary (correct / wrong / accuracy). `pill__value.mono` gives tabular-numerals stability so the timer doesn't jitter as seconds tick. The modern layout reuses the same class; the dock styling of pills is defined in `modern.css`.

### Option (quiz choice)

```html
<div class="option" role="button" tabindex="0">
  <div class="option__top">
    <div class="option__badge">1</div>
    <div class="option__text">…option text…</div>
  </div>
  <div class="option__translation">…EN or PT translation when enabled…</div>
</div>
```

The quiz's core primitive. Four modifier classes govern its state:

- `.option--correct` — green-tinted border+background (used alone in memorization mode to highlight the right answer, and in combination with feedback mode in training/test-results).
- `.option--wrong` — red-tinted border+background (chosen-wrong in training/test-results).
- `.option--chosen` — subtle blue outline indicating the user's selection (test mode, before finish).
- `.is-disabled` — reduces opacity and removes the cursor (memorization + test-results, where options are read-only).

The option is a `<div role="button">` rather than a `<button>` because a button element misrenders flex children on some mobile browsers; the click and keydown (Enter / Space) handlers are explicit.

### Button

Three variants of a single primitive:

```html
<button class="btn">Secondary</button>
<button class="btn btn--primary">Primary action</button>
<button class="btn btn--ghost">Tertiary / cancel</button>
```

- `.btn` — default: translucent white background, 1px translucent border, `font-weight: 700`.
- `.btn--primary` — cyan tint (`rgba(125,211,252,0.22)`), used for "confirm" / "next" actions.
- `.btn--ghost` — transparent background, used for cancel buttons and low-emphasis controls.

All three share the same 10px × 14px padding and 12px radius.

### Field (label + control)

```html
<label class="field" for="stateSelect">
  <span class="field__label">State (for test)</span>
  <select class="field__control" id="stateSelect"></select>
</label>
```

Stacked label-over-control pattern used in the sidebar settings. `.field__control` applies the consistent dark input/select style (`rgba(7,13,26,0.62)` background, `rgba(248,250,252,0.18)` border, 14px radius).

### Layout primitives

- `.row` — horizontal flex with 10px gap, wraps on small screens (`flex-wrap: wrap`). Used for button groups, topbar content, settings rows.
- `.row--right` — pushes children to the right edge (`justify-content: flex-end`). Used for cancel/OK button rows in modals.
- `.stack` — vertical grid with 10px gap. Used for lists of labelled checkboxes (reset modal), phrase lists (word modal), settings groups.
- `.grid` — responsive grid with 14px gap. `.grid--2` makes two columns, collapsing to one column below 840px. Used for the home page intro + explainer, the dictionary import/export card.

### Table

```html
<table class="table">
  <thead>
    <tr><th scope="col">Question</th><th scope="col">Attempts</th>…</tr>
  </thead>
  <tbody>…</tbody>
</table>
```

Full-width dark table used by Stats, Review, Test History, Test Results review, and the Dictionary list. Cells use the `.mono` class for numeric columns. The table primitive is styled once (`docs/styles/general.css`) and reused across every data view.

### Modal

```html
<div class="modal" id="wordModal" hidden role="dialog" aria-modal="true" aria-labelledby="wordModalTitle">
  <div class="modal__backdrop" data-close-modal="wordModal"></div>
  <div class="modal__panel">
    <div class="modal__header">
      <div class="modal__title">…</div>
      <button class="icon-btn" data-close-modal="wordModal" aria-label="Close">✕</button>
    </div>
    <div class="modal__content">…</div>
  </div>
</div>
```

Four modals ship:

- `#wordModal` — dictionary lookup with DE/EN/PT tabs.
- `#confirmModal` — generic yes/cancel (used by `View.showConfirm`).
- `#resetDataModal` — granular localStorage reset with checkboxes.
- `#questionReviewModal` — single-question full review (used from test-results / history tables).

Two panel widths: default (`min(860px, 100%)`) and `.modal__panel--sm` (`min(520px, 100%)`) for confirm-style dialogs. The backdrop has `[data-close-modal="id"]` and is wired globally so clicking it (or the close button, or Escape) closes the modal.

### Tabs (word definition DE/EN/PT)

```html
<div class="tabs" role="tablist">
  <button class="tab" role="tab" aria-selected="true">DE</button>
  <button class="tab" role="tab" aria-selected="false">EN</button>
  <button class="tab" role="tab" aria-selected="false">PT</button>
</div>
<div class="tab-panel">…definition for active language…</div>
```

Pill-shaped tabstrip with translucent "rail" background, used only inside `#wordModal`. Supports arrow-key navigation per WAI-ARIA `role="tablist"` conventions.

### Context menu (word actions)

```html
<div class="context-menu" id="wordContextMenu" hidden role="menu" aria-label="Word actions">
  <button class="context-menu__item" role="menuitem">View</button>
  <button class="context-menu__item" role="menuitem">Add</button>
</div>
```

Fixed-positioned 240px pill menu shown on desktop right-click of a `.word` token (or mobile long-press). Supports arrow-key / Home / End / Escape navigation.

### Toast

```html
<div class="toast" id="toast" hidden role="status" aria-live="polite" aria-atomic="true"></div>
```

Ephemeral notification (2.2s default duration). Fixed to the bottom-right corner. `aria-live="polite"` means screen readers announce it without interrupting the user's current flow.

### Word token

```html
<button class="word" data-word="Bundestag">Bundestag</button>
```

Every word in a question's text and options is wrapped in a `.word` button (generated by `renderSelectableText` in `_question-card.js`). Hovering tints it blue; clicking opens the dictionary on mobile, the context menu on desktop. Long-press on mobile forces the context menu.

### Badges

```html
<span class="badge-pass">✓ Correct</span>
<span class="badge-fail">✗ Wrong</span>
<span class="result-pill badge-pass--filled">✓ Pass</span>
<span class="result-pill badge-fail--filled">✗ Fail</span>
```

Four badge variants:

- **Text-coloured** (`badge-pass`, `badge-fail`) — inline in stats / review rows.
- **Filled pill** (`result-pill` + `badge-pass--filled`/`badge-fail--filled`) — the big pass/fail indicator in test-results / test-history-view title cards.

Separating these classes from inline styles (done in the last refactor pass) means a future redesign can change the badge look by editing one file.

### Skip link

```html
<a class="skip-link" href="#main">Skip to content</a>
```

First focusable element on every page. Absolutely positioned off-screen until `:focus`, then slides into view with a black-background chip. Keyboard-only and screen-reader users get direct access to `<main>` without tabbing through the sidebar.

## Layout systems

Two layouts ship, sharing 100% of the content CSS and JS. The difference is entirely in the shell.

### Classic (`index.html` + `general.css`)

```
┌───────────┬────────────────────────────────────┐
│           │ topbar (title + meta • timer • progress)
│  sidebar  ├────────────────────────────────────┤
│           │                                    │
│  (brand + │           main                     │
│   nav +   │                                    │
│   state + │                                    │
│   lang +  │                                    │
│   reset)  │                                    │
│           ├────────────────────────────────────┤
│           │ footer (Back • Home • Next)        │
└───────────┴────────────────────────────────────┘
```

Flex-based shell: fixed 292px sidebar on desktop (collapsible via the hamburger); main content capped at `--max: 1100px` and centred. On mobile (`max-width: 980px`), the sidebar becomes a full-width overlay drawer revealed by the hamburger button.

### Modern (`modern.html` + `modern.css` + `general.css`)

```
┌────────────────────────────────────────────────┐
│ ▒▒ glass header — brand • route • pills • ⚙ ▒▒ │  sticky, backdrop-blur
├────────────────────────────────────────────────┤
│                                                │
│                main (centered)                 │
│                                                │
│                                                │
├─ [Back • Home • Next] ─────────────────────────┤  floating pill bar
├────────────────────────────────────────────────┤
│ 🏠 📖 💪 ✍️ 🔁 📊 📘 ← dock, fixed bottom       │  safe-area aware
└────────────────────────────────────────────────┘
                                      ┌──── drawer (slides from right)
                                      │  settings + memorization sub-routes
                                      └────
```

CSS Grid shell with a sticky glass header at the top, a fixed bottom dock for primary navigation, a floating footer pill-bar above the dock for Back/Home/Next, and a right-side slide-out drawer for settings. Uses `env(safe-area-inset-*)` throughout so it feels native on notched phones with the address bar hidden.

The same data-slot templates fill `#main`, so **every content card looks identical in both layouts**. Only the chrome around main is different. This is the layout-swap contract in practice.

## Responsive breakpoints

Two breakpoints across both stylesheets:

| Breakpoint | What changes |
|---|---|
| `max-width: 980px` | Classic: sidebar becomes an overlay; `sidebar__close` button appears. Grid `--2` collapses to single column. |
| `max-width: 840px` | Content `.grid--2` collapses to one column. |
| `max-width: 720px` (modern only) | Dock label font shrinks, header hides route + subtitle + progress pill (keeps timer if active). Main padding tightens. |

There is no desktop breakpoint (the design is mobile-first; below 1100px main is full-width). `env(safe-area-inset-bottom)` is honoured in the modern dock so iPhone home-indicator doesn't overlap.

## Interaction patterns

- **Focus rings** — every `:focus-visible` gets `outline: 2px solid var(--focus)` with 2px offset. Consistent across buttons, options, inputs, tabs, menu items.
- **Hit targets ≥ 40px** — buttons use `10px × 14px` padding + 1em line-height → 40px+ tall. Option cells are even taller to accommodate two lines of text.
- **Word interactions**:
  - *Desktop*: left-click a word token opens the context menu at the mouse position; right-click is ignored (the browser's context menu shows instead, since we're not claiming to replace system interactions).
  - *Mobile*: tap opens the dictionary modal directly; long-press (450ms) opens the context menu positioned at the touch point.
- **Arrow-key navigation** — in memorization mode, left/right arrow keys trigger the Back/Next footer buttons. Suppressed when any modal is open, the word context menu is visible, or the user is typing in an input/textarea.
- **Escape behaviour** — closes the sidebar (if open), every modal (`wordModal`, `confirmModal`, `questionReviewModal`, `resetDataModal`), and the word context menu. One key, one expectation.
- **Toasts** — auto-dismiss after 2.2s by default. Never stack (a new toast replaces the previous). `aria-live="polite"` announces them without interrupting.
- **Modal focus** — on open, focus moves to the first non-close focusable element (input / button / select / `[tabindex]`). On close, focus returns to the element that triggered the modal (tracked in `_returnFocus` inside `view.js`).
- **Drawer dismissal** — clicking the backdrop (`#overlay`), pressing Escape, or clicking the dismiss button (✕) all close the drawer.

## Accessibility

Specific patterns wired into the codebase:

- **Skip link** first focusable element.
- **`role="dialog"` + `aria-modal="true"`** on every modal; `aria-labelledby` points to the modal title.
- **`role="tablist"` / `role="tab"` / `role="tabpanel"`** on the DE/EN/PT word definition tabs; `aria-selected` and `tabIndex` are updated by `_word-ui.js` to keep the active tab reachable by Tab.
- **`role="menu"` / `role="menuitem"`** on the word context menu; full arrow-key / Home / End / Escape navigation.
- **`aria-current="page"`** on the active nav item (set by `View.setActiveRoute`).
- **`aria-label`** on every icon-only button (hamburger, modal close, settings gear).
- **`aria-live="polite"` + `aria-atomic="true"`** on the toast.
- **Focus return** on modal close, handled by `View.closeModal` via `_returnFocus` map.
- **Language attribute** — `document.documentElement.lang` is updated to `de` / `en` / `pt-BR` by `syncStaticUITexts` so screen readers pronounce content correctly.
- **`tabindex="-1"` on `#main`** — allows the skip link to move focus there programmatically without adding it to the tab order.

## Iconography

Every icon in the UI is an emoji glyph:

- **Nav/dock** — 🏠 (home) 📖 (memorization) 💪 (training) ✍️ (test) 🔁 (review) 📊 (stats) 📘 (dictionary).
- **Chrome** — ☰ (hamburger) ✕ (close) ⚙ (settings) ← → (pagination hints).
- **Feedback** — ✓ ✗ (pass / fail indicators) 👁️ (view details) ❤️ (author credit).

This is a pragmatic choice: emoji render consistently across OS versions via the platform's native emoji font (which every modern OS ships), require zero bandwidth, and inherit the current text colour for monochromatic glyphs. No icon font download, no SVG sprite sheet, no tree-shaking complexity.

The trade-off is that the visual weight of emoji varies slightly between iOS and Android; accepted, because the alternative (a custom SVG library) is disproportionate effort for a personal project.

## Extending the design

To add a new component:

1. **Name it with the BEM-ish convention**: `.block` for the component, `.block__element` for sub-parts, `.block--modifier` for variants.
2. **Use existing design tokens** — `var(--radius)`, `var(--border)`, `var(--primary)`, etc. Avoid hard-coded hex. If you need a new colour, add a token to `:root`.
3. **Add the markup to `docs/partials/templates.html`** as a `<template id="tpl-...">` with `[data-slot]` anchors for dynamic text.
4. **Reuse layout primitives** (`.row`, `.stack`, `.grid`, `.field`) rather than adding new positioning CSS.
5. **Wire the renderer** in the appropriate `docs/scripts/modes/` file. Use `EBT.Templates.render(id, bindings)` to clone and populate.

To add a new layout:

1. Create a new HTML file with the **same 48 element IDs** from `selectors.js` (any structural shape).
2. Ship a companion stylesheet (see `styles/modern.css` as the pattern) — only restyle the shell, not the content primitives.
3. Load the **same script list** as `index.html`.
4. Add a test mirroring `tests/modern-layout.test.js` to verify the contract.

## Not part of the system

A few things the design deliberately doesn't have, and why:

- **No animations** beyond the drawer slide-in and backdrop fade. Motion is cheap to add and expensive to get right; the app stays still.
- **No icon library** (Feather, Heroicons, Tabler, …) — emoji cover the current need at zero cost.
- **No light theme.** Dark-first was chosen once and not revisited. The dark tokens make more sense for reading-heavy content in low-light study sessions.
- **No component library** (Radix, Headless UI, Reach, …). Every interactive component is hand-rolled in vanilla JS so the framework boundary stays zero.
- **No design language references** (Material, Carbon, Bootstrap). The app follows its own pragmatic conventions.
