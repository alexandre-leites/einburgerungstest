/**
 * Dictionary renderer — personal word list (view / import / export).
 * Extracted from general.js.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  window.EBT.Render = window.EBT.Render || {};

  window.EBT.Render.dictionary = function renderDictionary() {
    const Core = window.EBT.Core;
    const View = window.EBT.View;
    const Templates = window.EBT.Templates;
    const MyDict = window.EBT.MyDict;
    const Utils = window.EBT.Utils;
    if (!Core || !View || !Templates || !MyDict || !Utils) return;

    const t = Core.t;

    View.setActiveRoute("dictionary");
    View.setTitle(t("myDictionary"), "");
    View.setTimer({ visible: false });
    View.setFooterVisible(true);
    View.setProgress(0, 0);

    const all = MyDict.readAll();
    const words = Object.keys(all).sort((a, b) => a.localeCompare(b, "de"));

    if (!words.length) {
      const emptyFrag = Templates.render("tpl-dictionary-empty", {
        title: t("myDictionary"),
        empty: t("emptyDictionary"),
      });
      View.mountMain(emptyFrag);
      View.setFooterState({ backDisabled: true, nextDisabled: true, homeDisabled: false });
      return;
    }

    const frag = Templates.render("tpl-dictionary", {
      title: t("myDictionary"),
      exportLabel: t("export"),
      importLabel: t("import"),
      importLabel2: t("import"),
      cancelLabel: t("cancel"),
      wordHeader: t("word"),
      importPlaceholder: t("importPlaceholder"),
    });

    // Fragments expose [data-ref] anchors for scripts to bind behaviour to,
    // so the template is free to move these nodes around as long as the
    // refs stay reachable.
    const root = frag.firstElementChild;
    const importBox = root.querySelector('[data-ref="importBox"]');
    const importTextarea = root.querySelector('[data-ref="importTextarea"]');
    const tbody = root.querySelector('[data-ref="tbody"]');

    words.forEach((w) => {
      const display = all[w]?.word ?? w;
      const addedAt = all[w]?.addedAt ?? "";
      const tr = document.createElement("tr");
      const wordCell = document.createElement("td");
      const wordBtn = document.createElement("button");
      wordBtn.className = "btn btn--ghost";
      wordBtn.type = "button";
      wordBtn.dataset.word = w;
      wordBtn.textContent = display;
      wordCell.appendChild(wordBtn);
      const addedCell = document.createElement("td");
      addedCell.className = "mono muted";
      addedCell.textContent = String(addedAt).slice(0, 19).replace("T", " ");
      tr.appendChild(wordCell);
      tr.appendChild(addedCell);
      tbody.appendChild(tr);
    });

    root.querySelector('[data-action="export"]').addEventListener("click", async () => {
      const payload = JSON.stringify(all, null, 2);
      try {
        await navigator.clipboard?.writeText(payload);
      } catch (_e) {
        // clipboard unavailable — fall through silently
      }
      View.showToast(t("copiedToClipboard"));
    });

    root.querySelector('[data-action="import"]').addEventListener("click", () => {
      importBox.hidden = false;
      importTextarea.focus();
    });

    root.querySelector('[data-action="importCancel"]').addEventListener("click", () => {
      importBox.hidden = true;
      importTextarea.value = "";
    });

    root.querySelector('[data-action="importOk"]').addEventListener("click", () => {
      try {
        const raw = importTextarea.value;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") throw new Error("bad");
        const migrated = {};
        Object.keys(parsed).forEach((k) => {
          const canon = Utils.canonicalWordKey(k);
          if (!canon) return;
          const v = parsed[k] ?? {};
          migrated[canon] = {
            word: v.word ?? k,
            addedAt: v.addedAt ?? v.updatedAt ?? v.createdAt ?? new Date().toISOString(),
          };
        });
        MyDict.writeAll(migrated);
        View.showToast(t("importDone"));
        window.EBT.Render.dictionary();
      } catch (_err) {
        View.showToast(t("invalidJson"));
      }
    });

    root.querySelectorAll("[data-word]").forEach((b) => {
      b.addEventListener("click", () => Core.openWordModal(b.getAttribute("data-word")));
    });

    View.mountMain(frag);
    View.setFooterState({ backDisabled: true, nextDisabled: true, homeDisabled: false });
  };
})();
