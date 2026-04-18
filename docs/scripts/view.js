/**
 * View interface — the one and only DOM-mutation surface for chrome
 * (topbar, footer, sidebar, modals, toast, main content mount point).
 *
 * Renderers and the application shell should call these methods instead of
 * touching the DOM directly. An alternative layout only needs to provide
 * the elements referenced in selectors.js; this file resolves them lazily
 * on first use and degrades to no-ops when an optional element is absent.
 *
 * Loaded after selectors.js, before general.js / modes/*.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  // Cached element map, filled on first call (lazy so selectors.js load
  // order is tolerated even if callers fire before document is ready).
  let _els = null;
  function els() {
    if (_els) return _els;
    if (!window.EBT.Selectors) return Object.create(null);
    _els = window.EBT.Selectors.query();
    return _els;
  }

  // Force a re-resolve — useful for tests that swap documents.
  function refresh() {
    _els = null;
    return els();
  }

  function setText(el, text) {
    if (!el) return;
    el.textContent = text == null ? "" : String(text);
  }

  // ------------------------------------------------------------- Topbar ---

  function setTitle(title, meta) {
    const e = els();
    setText(e.routeTitle, title);
    setText(e.routeMeta, meta ?? "");
  }

  function setProgress(current, total) {
    const e = els();
    setText(e.progressValue, `${current}/${total}`);
  }

  /**
   * @param {{visible?: boolean, label?: string, value?: string}} opts
   */
  function setTimer(opts) {
    const e = els();
    if (!e.timerPill) return;
    const { visible, label, value } = opts || {};
    if (typeof visible === "boolean") e.timerPill.hidden = !visible;
    if (label != null) setText(e.timerLabel, label);
    if (value != null) setText(e.timerValue, value);
  }

  // ------------------------------------------------------------- Footer ---

  /**
   * @param {{backDisabled?: boolean, nextDisabled?: boolean, homeDisabled?: boolean}} opts
   */
  function setFooterState(opts) {
    const e = els();
    const { backDisabled, nextDisabled, homeDisabled } = opts || {};
    if (e.backBtn) e.backBtn.disabled = !!backDisabled;
    if (e.nextBtn) e.nextBtn.disabled = !!nextDisabled;
    if (e.homeBtn) e.homeBtn.disabled = !!homeDisabled;
  }

  function setFooterVisible(visible) {
    const e = els();
    if (e.pageFooter) e.pageFooter.hidden = !visible;
  }

  // ---------------------------------------------------------------- Nav ---

  /**
   * Mark nav items matching `route` (exact or by data-route-prefix) as
   * the current page. Works against whatever nav structure the layout uses
   * as long as items expose data-route / data-route-prefix attributes.
   */
  function setActiveRoute(route) {
    const items = document.querySelectorAll(".nav__item[data-route]");
    items.forEach((btn) => {
      const exact = btn.getAttribute("data-route") === route;
      const prefix = btn.getAttribute("data-route-prefix");
      const isActive = exact || (prefix && route && route.startsWith(prefix));
      if (isActive) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  // --------------------------------------------------------------- Main ---

  /**
   * Replace the main content area with the given node, fragment, or list
   * of nodes. Clears previous content first.
   */
  function mountMain(node) {
    const e = els();
    if (!e.main) return;
    clearMain();
    if (node == null) return;
    if (Array.isArray(node)) {
      for (const n of node) if (n) e.main.appendChild(n);
    } else {
      e.main.appendChild(node);
    }
  }

  function clearMain() {
    const e = els();
    if (!e.main) return;
    e.main.innerHTML = "";
  }

  function mainElement() {
    return els().main || null;
  }

  // ------------------------------------------------------------- Modals ---

  // modalId -> element that had focus when the modal opened; restored on close.
  const _returnFocus = Object.create(null);

  function firstFocusable(root) {
    if (!root) return null;
    const candidates = root.querySelectorAll(
      'button:not([data-close-modal]):not([aria-label="Close"]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
    );
    for (const el of candidates) {
      if (el.offsetParent !== null || el === document.activeElement) return el;
    }
    return root.querySelector('[data-close-modal], [aria-label="Close"]') || null;
  }

  /**
   * Show a confirm dialog. Binds a one-shot click handler on the
   * confirmOkBtn — the caller's `onOk` runs once, then the handler is
   * removed so subsequent confirmDialog() calls don't stack.
   *
   * @param {string} text — message to show
   * @param {() => void} onOk
   */
  function showConfirm(text, onOk) {
    const e = els();
    if (e.confirmText) e.confirmText.textContent = text;
    openModal("confirmModal");
    if (!e.confirmOkBtn) return;
    const handler = () => {
      e.confirmOkBtn.removeEventListener("click", handler);
      closeModal("confirmModal");
      if (typeof onOk === "function") onOk();
    };
    e.confirmOkBtn.addEventListener("click", handler);
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const prev = document.activeElement;
    if (prev && prev !== document.body) _returnFocus[modalId] = prev;
    modal.hidden = false;
    modal.style.display = "grid";
    const target = firstFocusable(modal);
    if (target && typeof target.focus === "function") {
      window.requestAnimationFrame(() => target.focus());
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.hidden = true;
    modal.style.display = "none";
    const prev = _returnFocus[modalId];
    delete _returnFocus[modalId];
    if (prev && typeof prev.focus === "function" && document.contains(prev)) {
      try {
        prev.focus();
      } catch (_e) {
        // Element may have been removed from the DOM since opening.
      }
    }
  }

  // --------------------------------------------------------------- i18n ---

  /**
   * Walk every `[data-i18n]` element in the document (and in inline
   * `<template>` fragments) and set its textContent to `translate(key)`.
   * Elements with `data-i18n-literal` are set to the literal attribute
   * value — useful for strings that don't live in the translation
   * catalogue but should still be overridable per layout.
   */
  function applyI18n(translate) {
    if (typeof translate !== "function") return;
    const nodes = document.querySelectorAll("[data-i18n]");
    for (const el of nodes) {
      const key = el.getAttribute("data-i18n");
      if (!key) continue;
      el.textContent = translate(key) || "";
    }
    const literals = document.querySelectorAll("[data-i18n-literal]");
    for (const el of literals) {
      el.textContent = el.getAttribute("data-i18n-literal") || "";
    }
  }

  // -------------------------------------------------------------- Toast ---

  let _toastTimer = null;
  function showToast(message, opts) {
    const e = els();
    if (!e.toast) return;
    const durationMs = (opts && opts.durationMs) || 2200;
    setText(e.toast, message);
    e.toast.hidden = false;
    if (_toastTimer) window.clearTimeout(_toastTimer);
    _toastTimer = window.setTimeout(() => {
      e.toast.hidden = true;
    }, durationMs);
  }

  // ------------------------------------------------------------ Sidebar ---

  function isMobileNav() {
    return window.matchMedia("(max-width: 980px)").matches;
  }

  /**
   * When the sidebar element is tagged with `data-behavior="drawer"` (as
   * in the modern layout) it toggles in/out on every breakpoint via the
   * `is-open` class. The classic layout treats the sidebar as an
   * always-visible panel on desktop and only overlays it on mobile.
   */
  function isDrawerMode() {
    const e = els();
    return e.sidebar?.dataset?.behavior === "drawer";
  }

  function openSidebar() {
    const e = els();
    if (!e.sidebar) return;
    if (!isDrawerMode() && !isMobileNav()) return;
    e.sidebar.classList.add("is-open");
    if (e.overlay) e.overlay.hidden = false;
  }

  function closeSidebar() {
    const e = els();
    if (!e.sidebar) return;
    if (!isDrawerMode() && !isMobileNav()) return;
    e.sidebar.classList.remove("is-open");
    if (e.overlay) e.overlay.hidden = true;
  }

  function toggleSidebar() {
    const e = els();
    if (!e.sidebar) return;
    if (isDrawerMode() || isMobileNav()) {
      const isOpen = e.sidebar.classList.contains("is-open");
      if (isOpen) closeSidebar();
      else openSidebar();
      return;
    }
    // Classic desktop: collapse/expand the persistent sidebar in-place.
    e.sidebar.classList.toggle("is-collapsed");
    if (e.overlay) e.overlay.hidden = true;
  }

  function syncSidebarForViewport() {
    const e = els();
    if (!e.sidebar) return;
    if (isDrawerMode()) {
      // Drawer layouts never auto-open on breakpoint change; leave
      // whatever state the user set.
      return;
    }
    if (isMobileNav()) {
      e.sidebar.classList.remove("is-collapsed");
      const isOpen = e.sidebar.classList.contains("is-open");
      if (e.overlay) e.overlay.hidden = !isOpen;
      return;
    }
    e.sidebar.classList.remove("is-open");
    if (e.overlay) e.overlay.hidden = true;
  }

  // --------------------------------------------------------------- API ---

  window.EBT.View = {
    // Lifecycle
    refresh,
    mainElement,
    // Topbar
    setTitle,
    setProgress,
    setTimer,
    // Footer
    setFooterState,
    setFooterVisible,
    // Nav
    setActiveRoute,
    // i18n
    applyI18n,
    // Main
    mountMain,
    clearMain,
    // Modals
    openModal,
    closeModal,
    showConfirm,
    // Toast
    showToast,
    // Sidebar
    openSidebar,
    closeSidebar,
    toggleSidebar,
    syncSidebarForViewport,
    isMobileNav,
  };
})();
