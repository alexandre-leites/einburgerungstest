/**
 * Word UI — the modal that shows a word's base-dictionary entry, plus the
 * context menu shown on desktop right-click / mobile long-press.
 *
 * Both reach back into EBT.Core for state, translations, and dictionary
 * lookup. Installed onto EBT.Core by general.js via thin wrappers.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  // Pending rAF id for the "focus first menu item" scheduled when the
  // context menu opens. Cancelled on close so focus doesn't land on a
  // menu that's about to be hidden (leaving the DOM in an unfocused
  // state, or focusing a hidden element).
  let _pendingFocusRaf = null;

  function closeContextMenu() {
    if (_pendingFocusRaf != null) {
      window.cancelAnimationFrame(_pendingFocusRaf);
      _pendingFocusRaf = null;
    }
    const els = window.EBT.Selectors.query();
    if (!els.wordContextMenu) return;
    els.wordContextMenu.hidden = true;
  }

  function positionContextMenu(x, y) {
    const els = window.EBT.Selectors.query();
    const menu = els.wordContextMenu;
    if (!menu) return;
    // Park off-screen first so the user never sees the menu at (0,0).
    menu.style.left = "-9999px";
    menu.style.top = "-9999px";
    menu.hidden = false;

    const place = () => {
      const rect = menu.getBoundingClientRect();
      // Width is fixed in CSS (240px) but height depends on the translated
      // button text, which was just set and may not have contributed to
      // layout yet. Fall back to offsetHeight as a belt-and-braces measure.
      const w = rect.width || menu.offsetWidth || 240;
      const h = rect.height || menu.offsetHeight || 96;
      const maxX = window.innerWidth - w - 8;
      const maxY = window.innerHeight - h - 8;
      const px = Math.max(8, Math.min(x, maxX));
      const py = Math.max(8, Math.min(y, maxY));
      menu.style.left = `${px}px`;
      menu.style.top = `${py}px`;
    };

    // On the very first show, the element has just transitioned from
    // display:none (via the `hidden` attribute). Some browsers don't flush
    // layout until the next frame, so measuring synchronously can still
    // return a height of 0. Always defer the first show to rAF; subsequent
    // shows can place synchronously without any visible hop.
    if (!menu.dataset.positionedOnce) {
      menu.dataset.positionedOnce = "1";
      window.requestAnimationFrame(place);
    } else {
      place();
    }
  }

  function openContextMenu(wordRaw, point) {
    const Core = window.EBT.Core;
    const Utils = window.EBT.Utils;
    const MyDict = window.EBT.MyDict;
    const els = window.EBT.Selectors.query();
    if (!Core || !Utils || !MyDict) return;

    const display = Utils.normalizeWord(wordRaw);
    const canon = Utils.canonicalWordKey(wordRaw);
    if (!display || !canon) return;

    const resolved = Core.findBaseDictionaryEntry(display);
    Core.state.currentWord = resolved?.key ?? canon;
    Core.state.currentWordDisplay = display;

    if (els.wordCtxViewBtn) els.wordCtxViewBtn.textContent = Core.t("viewDefinition");
    if (els.wordCtxToggleBtn) {
      const saved = MyDict.has(Core.state.currentWord);
      els.wordCtxToggleBtn.textContent = saved
        ? Core.t("removeFromMyDictionary")
        : Core.t("addToMyDictionary");
    }

    positionContextMenu(point.x, point.y);
    if (els.wordCtxViewBtn && typeof els.wordCtxViewBtn.focus === "function") {
      if (_pendingFocusRaf != null) window.cancelAnimationFrame(_pendingFocusRaf);
      _pendingFocusRaf = window.requestAnimationFrame(() => {
        _pendingFocusRaf = null;
        try {
          els.wordCtxViewBtn.focus();
        } catch (_e) {
          // Focus may fail on hidden element — ignore.
        }
      });
    }
  }

  function hasRealDefinitionFor(entry, lemma) {
    if (!entry) return false;
    const d = String(entry.description ?? "").trim();
    if (!d) return false;
    return d.toLowerCase() !== lemma;
  }

  function renderPanel({ Core, Utils, entry, langKey, word, lemma, tabIdPrefix }) {
    const panel = document.createElement("div");
    panel.className = "tab-panel";
    panel.dataset.panel = langKey;
    panel.setAttribute("role", "tabpanel");
    panel.id = `${tabIdPrefix}-panel-${langKey}`;
    panel.hidden = true;

    if (!entry) {
      const p = document.createElement("div");
      p.className = "muted";
      p.textContent = Core.t("notInBaseDictionary");
      panel.appendChild(p);
      return panel;
    }

    const desc = document.createElement("div");
    desc.className = "muted";
    const descText = String(entry.description ?? "").trim();
    const isJustLemma = descText && descText.toLowerCase() === lemma;
    desc.textContent = descText && !isJustLemma ? descText : Core.t("noDefinition");
    panel.appendChild(desc);

    if (Array.isArray(entry.phrases) && entry.phrases.length) {
      const ul = document.createElement("div");
      ul.className = "stack";
      const highlightTarget = langKey === "de" ? word : String(entry.description ?? "").trim();
      entry.phrases.slice(0, 6).forEach((ph) => {
        const item = document.createElement("div");
        // highlightWord returns an HTML string with <mark>…</mark> already
        // around the matched form; kept as innerHTML deliberately (inputs
        // are our own dictionary payload, not user-supplied).
        item.innerHTML = `• ${Utils.highlightWord(ph, highlightTarget)}`;
        ul.appendChild(item);
      });
      panel.appendChild(ul);
    }
    return panel;
  }

  function openModal(wordRaw) {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const Utils = window.EBT.Utils;
    const els = window.EBT.Selectors.query();
    if (!Core || !View || !Utils) return;

    const t = Core.t;
    const state = Core.state;

    const word = Utils.normalizeWord(wordRaw);
    const canon = Utils.canonicalWordKey(wordRaw);
    if (!word || !canon) return;

    const resolved = Core.findBaseDictionaryEntry(word);
    state.currentWord = resolved?.key ?? canon;
    state.currentWordDisplay = word;

    const titleSuffix = resolved && resolved.key !== canon ? ` (${resolved.key})` : "";
    if (els.wordModalTitle) els.wordModalTitle.textContent = `${t("word")}: ${word}${titleSuffix}`;
    if (els.wordModalSubtitle) {
      els.wordModalSubtitle.textContent = state.lang === "de"
        ? "DE → EN/PT"
        : `${state.lang.toUpperCase()} (UI)`;
    }
    if (els.wordBaseTitle) els.wordBaseTitle.textContent = t("baseDictionary");

    const base = resolved ?? Core.findBaseDictionaryEntry(word);
    if (!els.wordBaseContent) return;
    els.wordBaseContent.replaceChildren();

    if (!base) {
      const p = document.createElement("div");
      p.className = "muted";
      p.textContent = t("notInBaseDictionary");
      els.wordBaseContent.appendChild(p);
      View.openModal("wordModal");
      return;
    }

    const langs = [
      { key: "de", label: "DE" },
      { key: "en", label: "EN" },
      { key: "pt", label: "PT" },
    ];
    const lemma = String(base.key ?? word).trim().toLowerCase();
    const preferredTab = state.lang === "pt" ? "pt" : state.lang === "en" ? "en" : "de";
    const defaultTab = hasRealDefinitionFor(base.entry?.[preferredTab], lemma)
      ? preferredTab
      : (langs.find((l) => hasRealDefinitionFor(base.entry?.[l.key], lemma))?.key ?? preferredTab);
    const tabIdPrefix = `wordTab-${Date.now()}`;

    const tabs = document.createElement("div");
    tabs.className = "tabs";
    tabs.setAttribute("role", "tablist");
    const panelsWrap = document.createElement("div");

    const setActive = (activeKey) => {
      langs.forEach((l) => {
        const btn = tabs.querySelector(`[data-tab="${l.key}"]`);
        const panel = panelsWrap.querySelector(`[data-panel="${l.key}"]`);
        if (!btn || !panel) return;
        const isActive = l.key === activeKey;
        btn.setAttribute("aria-selected", String(isActive));
        btn.tabIndex = isActive ? 0 : -1;
        panel.hidden = !isActive;
      });
    };

    langs.forEach((l, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tab";
      btn.dataset.tab = l.key;
      btn.id = `${tabIdPrefix}-tab-${l.key}`;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-controls", `${tabIdPrefix}-panel-${l.key}`);
      btn.setAttribute("aria-selected", "false");
      btn.tabIndex = -1;
      btn.textContent = l.label;
      btn.addEventListener("click", () => setActive(l.key));
      btn.addEventListener("keydown", (ev) => {
        if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
        ev.preventDefault();
        const next = ev.key === "ArrowRight" ? idx + 1 : idx - 1;
        const wrapped = (next + langs.length) % langs.length;
        const nextKey = langs[wrapped].key;
        setActive(nextKey);
        const nextBtn = tabs.querySelector(`[data-tab="${nextKey}"]`);
        nextBtn?.focus();
      });
      tabs.appendChild(btn);
      panelsWrap.appendChild(
        renderPanel({ Core, Utils, entry: base.entry?.[l.key], langKey: l.key, word, lemma, tabIdPrefix }),
      );
    });

    els.wordBaseContent.appendChild(tabs);
    els.wordBaseContent.appendChild(panelsWrap);
    setActive(defaultTab);

    View.openModal("wordModal");
  }

  /**
   * Wire the arrow-key / Home / End / Escape navigation inside the word
   * context menu. Call once during app init, after selectors have
   * resolved.
   */
  function wireContextMenuKeyboardNav() {
    const els = window.EBT.Selectors.query();
    const menu = els.wordContextMenu;
    if (!menu) return;
    menu.addEventListener("keydown", (ev) => {
      const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
      if (items.length === 0) return;
      const active = document.activeElement;
      const idx = items.indexOf(active);
      if (ev.key === "ArrowDown") {
        ev.preventDefault();
        items[(idx + 1 + items.length) % items.length].focus();
      } else if (ev.key === "ArrowUp") {
        ev.preventDefault();
        items[(idx - 1 + items.length) % items.length].focus();
      } else if (ev.key === "Home") {
        ev.preventDefault();
        items[0].focus();
      } else if (ev.key === "End") {
        ev.preventDefault();
        items[items.length - 1].focus();
      } else if (ev.key === "Escape") {
        ev.preventDefault();
        closeContextMenu();
      }
    });
  }

  /**
   * Wire the global "click on a .word token" dispatch + toggle button +
   * view button + outside-click / touch-longpress handlers for the word
   * context menu. Everything word-UI-specific in one place.
   */
  function isTouchPrimary() {
    try {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const noHover = window.matchMedia("(hover: none)").matches;
      if (coarse && noHover) return true;
    } catch (_e) {
      // matchMedia may be unavailable in some environments.
    }
    return (navigator.maxTouchPoints ?? 0) > 0;
  }

  function wireWordInteractions() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const MyDict = window.EBT.MyDict;
    const els = window.EBT.Selectors.query();
    if (!Core || !View || !MyDict) return;
    const state = Core.state;
    const t = Core.t;

    // Context menu "view" button.
    if (els.wordCtxViewBtn) {
      els.wordCtxViewBtn.addEventListener("click", () => {
        closeContextMenu();
        openModal(state.currentWordDisplay ?? state.currentWord);
      });
    }

    // Context menu "add / remove from dictionary" button.
    if (els.wordCtxToggleBtn) {
      els.wordCtxToggleBtn.addEventListener("click", () => {
        const key = state.currentWord;
        const display = state.currentWordDisplay ?? key;
        if (!key) return;
        if (MyDict.has(key)) {
          MyDict.remove(key);
          View.showToast(t("removedFromMyDictionary"));
        } else {
          const sizeBefore = Object.keys(MyDict.readAll()).length;
          MyDict.add(key, display);
          const sizeAfter = Object.keys(MyDict.readAll()).length;
          if (sizeAfter < sizeBefore) View.showToast(t("dictionaryFull"));
          else View.showToast(t("addedToMyDictionary"));
        }
        closeContextMenu();
        if (state.route === "dictionary") window.EBT.Render.dictionary?.();
      });
    }

    wireContextMenuKeyboardNav();

    // Click on a `.word` token: desktop shows the context menu anchored
    // below the word; mobile opens the modal directly.
    document.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const w = target.closest?.(".word");
      if (!(w instanceof HTMLElement)) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      if (state.ignoreNextWordClick) {
        state.ignoreNextWordClick = false;
        return;
      }
      if (View.isMobileNav()) {
        openModal(w.dataset.word);
        return;
      }
      const r = w.getBoundingClientRect();
      openContextMenu(w.dataset.word, { x: r.left + r.width / 2, y: r.bottom + 8 });
    });

    // Dismiss context menu when clicking anywhere outside a .word or the menu.
    document.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest?.(".word")) return;
      if (target.closest?.("#wordContextMenu")) return;
      closeContextMenu();
    });

    // Long-press on mobile to open the context menu even on mobile layout.
    document.addEventListener(
      "touchstart",
      (ev) => {
        const target = ev.target;
        if (!(target instanceof HTMLElement)) return;
        const w = target.closest?.(".word");
        if (!(w instanceof HTMLElement)) return;
        if (!isTouchPrimary()) return;
        if (state.wordLongPressTimer) window.clearTimeout(state.wordLongPressTimer);
        const touch = ev.touches?.[0];
        if (!touch) return;
        state.wordLongPressTimer = window.setTimeout(() => {
          state.ignoreNextWordClick = true;
          openContextMenu(w.dataset.word, { x: touch.clientX, y: touch.clientY });
        }, 450);
      },
      { passive: true },
    );
    const clearLongPress = () => {
      if (state.wordLongPressTimer) window.clearTimeout(state.wordLongPressTimer);
      state.wordLongPressTimer = null;
    };
    document.addEventListener("touchend", clearLongPress, { passive: true });
    document.addEventListener("touchcancel", clearLongPress, { passive: true });
  }

  window.EBT.WordUI = {
    openModal,
    openContextMenu,
    closeContextMenu,
    wireContextMenuKeyboardNav,
    wireWordInteractions,
  };
})();
