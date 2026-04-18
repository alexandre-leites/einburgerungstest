#!/usr/bin/env node
/**
 * Compare translation coverage across docs/assets/i18n/{de,en,pt}.json.
 *
 * DE is the source of truth. Any key in DE missing from EN or PT is flagged.
 * Keys present in EN/PT but not in DE are also flagged (usually a stale key
 * left behind after a rename).
 *
 * Exits non-zero if any drift is found so this can be wired into CI.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const I18N_DIR = path.resolve(__dirname, "..", "docs", "assets", "i18n");

const LANGS = ["de", "en", "pt"];

function loadLang(lang) {
  const p = path.join(I18N_DIR, `${lang}.json`);
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

function main() {
  const dicts = Object.fromEntries(LANGS.map((lang) => [lang, loadLang(lang)]));
  const deKeys = new Set(Object.keys(dicts.de));
  let issues = 0;

  for (const lang of ["en", "pt"]) {
    const cur = new Set(Object.keys(dicts[lang]));
    const missing = [...deKeys].filter((k) => !cur.has(k));
    const extra = [...cur].filter((k) => !deKeys.has(k));
    const empty = [...cur].filter((k) => {
      const v = dicts[lang][k];
      return typeof v !== "string" || v.trim() === "";
    });
    if (missing.length) {
      console.error(`[i18n] ${lang}.json missing ${missing.length} key(s):`, missing);
      issues += missing.length;
    }
    if (extra.length) {
      console.error(`[i18n] ${lang}.json has ${extra.length} key(s) not in de.json:`, extra);
      issues += extra.length;
    }
    if (empty.length) {
      console.error(`[i18n] ${lang}.json has ${empty.length} empty value(s):`, empty);
      issues += empty.length;
    }
    console.log(
      `[i18n] ${lang}: ${cur.size} keys (missing=${missing.length}, extra=${extra.length}, empty=${empty.length})`,
    );
  }

  // Also flag empty DE values.
  const deEmpty = [...deKeys].filter((k) => {
    const v = dicts.de[k];
    return typeof v !== "string" || v.trim() === "";
  });
  if (deEmpty.length) {
    console.error(`[i18n] de.json has ${deEmpty.length} empty value(s):`, deEmpty);
    issues += deEmpty.length;
  }
  console.log(`[i18n] de: ${deKeys.size} keys (empty=${deEmpty.length})`);

  if (issues > 0) {
    console.error(`[i18n] FAIL: ${issues} issue(s) total`);
    process.exit(1);
  }
  console.log("[i18n] OK: all languages in sync");
}

main();
