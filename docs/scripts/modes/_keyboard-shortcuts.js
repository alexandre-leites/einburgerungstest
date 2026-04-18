/**
 * Global keyboard shortcuts:
 *  - Escape: close sidebar, all modals, and the word context menu.
 *  - ArrowLeft / ArrowRight on memorization routes: step prev / next
 *    (suppressed while typing, while a modal is open, or while the
 *    word context menu is visible).
 *
 * Wired once during init via EBT.Keyboard.wire().
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  const MEMORIZATION_ROUTES = new Set([
    "mode/memorization/random",
    "mode/memorization/ordered",
  ]);

  function isEditable(target) {
    if (!target) return false;
    const tag = target.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
  }

  function anyModalOpen() {
    return !!document.querySelector(".modal:not([hidden])");
  }

  function wire() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    if (!Core || !View) return;
    const els = window.EBT.Selectors.query();

    window.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        View.closeSidebar();
        View.closeModal("wordModal");
        View.closeModal("confirmModal");
        View.closeModal("questionReviewModal");
        View.closeModal("resetDataModal");
        window.EBT.WordUI?.closeContextMenu();
        return;
      }

      if (ev.key === "ArrowLeft" || ev.key === "ArrowRight") {
        if (!MEMORIZATION_ROUTES.has(Core.state.route)) return;
        if (isEditable(ev.target)) return;
        if (anyModalOpen()) return;
        if (els.wordContextMenu && !els.wordContextMenu.hidden) return;

        ev.preventDefault();
        if (ev.key === "ArrowLeft") els.backBtn?.click();
        else els.nextBtn?.click();
      }
    });
  }

  window.EBT.Keyboard = { wire };
})();
