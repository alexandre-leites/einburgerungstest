/**
 * Template helper — renderers clone <template id="tpl-..."> fragments from
 * index.html and populate named slots, instead of building HTML with
 * innerHTML string concatenation. Keeps markup in markup.
 *
 * Slot convention:
 *   <span data-slot="title"></span>   — textContent target
 *   <img data-slot="hero" data-slot-attr="src" />  — attribute target
 *
 * Usage:
 *   const frag = EBT.Templates.clone("tpl-home-intro");
 *   EBT.Templates.fill(frag, { title: "Welcome", body: "Hello world" });
 *   container.appendChild(frag);
 *
 * Or one-shot:
 *   const frag = EBT.Templates.render("tpl-home-intro", { title, body });
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};

  function clone(id) {
    const tpl = document.getElementById(id);
    if (!tpl || !("content" in tpl)) {
      throw new Error(`[templates] missing <template id="${id}">`);
    }
    return tpl.content.cloneNode(true);
  }

  /**
   * Populate [data-slot] elements in a fragment. Values are inserted via
   * textContent (or as an attribute when data-slot-attr is present).
   * Undefined keys are silently skipped so templates can have optional
   * slots. Pass an Element/Node/DocumentFragment to replace a slot's
   * children with nodes instead of text.
   */
  function fill(fragment, bindings) {
    if (!fragment || !bindings) return fragment;
    const nodes = fragment.querySelectorAll("[data-slot]");
    for (const node of nodes) {
      const name = node.getAttribute("data-slot");
      if (!(name in bindings)) continue;
      const value = bindings[name];
      if (value == null) {
        node.textContent = "";
        continue;
      }
      const attr = node.getAttribute("data-slot-attr");
      if (attr) {
        node.setAttribute(attr, String(value));
        continue;
      }
      if (value instanceof Node) {
        node.textContent = "";
        node.appendChild(value);
        continue;
      }
      if (Array.isArray(value)) {
        node.textContent = "";
        for (const v of value) {
          if (v instanceof Node) node.appendChild(v);
          else if (v != null) node.appendChild(document.createTextNode(String(v)));
        }
        continue;
      }
      node.textContent = String(value);
    }
    return fragment;
  }

  function render(id, bindings) {
    return fill(clone(id), bindings);
  }

  /**
   * Fetch an HTML partial containing `<template>` blocks and inject the
   * templates into the current document. Skips any templates whose id
   * already exists (so inline fallbacks keep working if present).
   *
   * Resolves once injection is complete. Caller must await before the
   * first renderer runs.
   */
  async function loadFromUrl(url) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`[templates] failed to fetch ${url}: ${res.status}`);
    const text = await res.text();
    // Parse as a detached fragment — avoids running any scripts the
    // partial might contain (shouldn't, but be defensive).
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${text}</body>`, "text/html");
    const templates = doc.querySelectorAll("template[id]");
    let injected = 0;
    for (const tpl of templates) {
      if (document.getElementById(tpl.id)) continue;
      document.body.appendChild(document.importNode(tpl, true));
      injected += 1;
    }
    return injected;
  }

  window.EBT.Templates = { clone, fill, render, loadFromUrl };
})();
