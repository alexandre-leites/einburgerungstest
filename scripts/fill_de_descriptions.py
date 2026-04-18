#!/usr/bin/env python3
"""Fill missing German descriptions in docs/assets/dictionary.json.

For entries whose ``de.description`` equals the lemma itself (a data artefact
that makes the dictionary view useless on the DE tab), fetch the first
``Bedeutungen`` definition from de.wiktionary.org, clean the wiki markup and
write it back.  Entries that cannot be resolved are left untouched so the UI
still falls back to "Keine Definition verfügbar".
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

DICT_PATH = Path(__file__).resolve().parent.parent / "docs" / "assets" / "dictionary.json"
API = "https://de.wiktionary.org/w/api.php"
USER_AGENT = (
    "einburgerungstest-dict-filler/1.0 "
    "(https://github.com/; educational; contact: local)"
)


def fetch_wikitext(title: str, timeout: float = 15.0) -> str | None:
    params = {
        "action": "parse",
        "page": title,
        "prop": "wikitext",
        "format": "json",
        "formatversion": "2",
        "redirects": "1",
    }
    url = f"{API}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.load(resp)
    except Exception:
        return None
    if "error" in data:
        return None
    return data.get("parse", {}).get("wikitext")


# --- Wiki markup cleanup ---------------------------------------------------

_TEMPLATE_RE = re.compile(r"\{\{([^{}]*)\}\}")
_LINK_RE = re.compile(r"\[\[([^\[\]|]+)\|([^\[\]]+)\]\]")
_LINK_SIMPLE_RE = re.compile(r"\[\[([^\[\]]+)\]\]")
_ITALIC_BOLD_RE = re.compile(r"'{2,5}")
_HTML_TAG_RE = re.compile(r"<[^>]+>")
_REF_RE = re.compile(r"<ref[^>]*>.*?</ref>", re.DOTALL)
_WS_RE = re.compile(r"\s+")

# Templates we unwrap to their first argument (e.g. {{K|Recht}} -> "Recht:")
_UNWRAP_TEMPLATES = {"K", "kontext", "Kontext"}


def _strip_templates(text: str) -> str:
    # Iteratively remove innermost templates. Unwrap a small whitelist first.
    prev = None
    while prev != text:
        prev = text

        def _repl(m: re.Match[str]) -> str:
            inner = m.group(1)
            parts = inner.split("|")
            name = parts[0].strip()
            if name in _UNWRAP_TEMPLATES and len(parts) > 1:
                # "K|Recht|Politik" -> "Recht, Politik:"
                labels = [p.strip() for p in parts[1:] if p.strip() and "=" not in p]
                return (", ".join(labels) + ": ") if labels else ""
            # Otherwise drop the template entirely.
            return ""

        text = _TEMPLATE_RE.sub(_repl, text)
    return text


def clean_wiki(text: str) -> str:
    text = _REF_RE.sub("", text)
    text = _strip_templates(text)
    text = _LINK_RE.sub(lambda m: m.group(2), text)
    text = _LINK_SIMPLE_RE.sub(lambda m: m.group(1), text)
    text = _ITALIC_BOLD_RE.sub("", text)
    text = _HTML_TAG_RE.sub("", text)
    text = text.replace("&nbsp;", " ")
    text = _WS_RE.sub(" ", text).strip()
    # Trim stray leading punctuation.
    text = text.lstrip(":;,. ").strip()
    return text


# --- Bedeutungen extraction -----------------------------------------------

_BED_HEADER_RE = re.compile(r"\{\{\s*Bedeutungen\s*\}\}")
_MEANING_LINE_RE = re.compile(r"^:\s*\[\s*1[a-z]?\s*\]\s*(.*)$")
_ANY_MEANING_LINE_RE = re.compile(r"^:\s*\[\s*(\d+)[a-z]?\s*\]\s*(.*)$")
_STOP_SECTION_RE = re.compile(r"^\s*\{\{\s*(Herkunft|Synonyme|Gegenwörter|Oberbegriffe|Unterbegriffe|Beispiele|Redewendungen|Sprichwörter|Charakteristische Wortkombinationen|Abgeleitete Begriffe|Übersetzungen|Referenzen)\s*\}\}\s*$")
_WORTART_RE = re.compile(r"\{\{\s*Wortart\s*\|\s*([^|}]+?)\s*(?:\|[^}]*)?\}\}")

# Preferred Wortart (part-of-speech) ranking. Function words first so short
# lemmas like "als", "bei", "für", "hat" don't get the Eigenname/Substantiv
# section that happens to be listed first on the page.
_WORTART_PRIORITY = {
    "Konjunktion": 0,
    "Subjunktion": 1,
    "Präposition": 2,
    "Artikel": 3,
    "Pronomen": 4,
    "Adverb": 5,
    "Modalpartikel": 6,
    "Partikel": 7,
    "Numerale": 8,
    "Verb": 9,
    "Hilfsverb": 9,
    "Modalverb": 9,
    "Partizip I": 10,
    "Partizip II": 10,
    "Adjektiv": 11,
    "Substantiv": 12,
    "Toponym": 20,
    "Nachname": 21,
    "Vorname": 21,
    "Eigenname": 22,
    "Abkürzung": 23,
}


def _extract_first_meaning_in_block(block: str) -> str | None:
    collected: list[str] = []
    for raw_line in block.splitlines():
        line = raw_line.rstrip()
        if not line.strip():
            if collected:
                break
            continue
        if _STOP_SECTION_RE.match(line):
            break
        if line.startswith("==") or line.startswith("{{Wortart"):
            break
        any_mm = _ANY_MEANING_LINE_RE.match(line)
        if any_mm:
            slot = int(any_mm.group(1))
            if slot != 1:
                break
            if collected:
                break
            collected.append(any_mm.group(2))
        elif collected and line.startswith(":"):
            collected.append(line.lstrip(": "))
        elif collected:
            break

    if not collected:
        return None
    cleaned = clean_wiki(" ".join(collected))
    if len(cleaned) < 3:
        return None
    return cleaned


def _split_wortart_sections(german_section: str) -> list[tuple[str, str]]:
    """Return list of (wortart, body) pairs within a German language section."""
    # Split on `=== ... ===` level-3 headings.
    parts = re.split(r"\n(?====[^=])", german_section)
    sections: list[tuple[str, str]] = []
    for part in parts:
        head_match = re.match(r"===\s*(.*?)\s*===\s*\n(.*)", part, flags=re.DOTALL)
        if not head_match:
            # Before the first Wortart header — use a generic label.
            sections.append(("", part))
            continue
        head, body = head_match.group(1), head_match.group(2)
        wortart_names = _WORTART_RE.findall(head)
        label = wortart_names[0].strip() if wortart_names else head.strip()
        sections.append((label, body))
    return sections


def extract_first_meaning(wikitext: str) -> str | None:
    # Locate the German language section (may be multiple on one page).
    german_iter = list(re.finditer(r"==\s*([^=]+?)\s*\(\{\{Sprache\|Deutsch\}\}\)\s*==", wikitext))
    if not german_iter:
        return None

    candidates: list[tuple[int, str]] = []  # (priority, meaning)
    for idx, m in enumerate(german_iter):
        start = m.end()
        end = german_iter[idx + 1].start() if idx + 1 < len(german_iter) else len(wikitext)
        section_body = wikitext[start:end]
        # Stop at next top-level language header if any leaked in.
        lang_stop = re.search(r"\n==\s*[^=]+\(\{\{Sprache\|", section_body)
        if lang_stop:
            section_body = section_body[: lang_stop.start()]
        for wortart, body in _split_wortart_sections(section_body):
            bed = _BED_HEADER_RE.search(body)
            if not bed:
                continue
            meaning = _extract_first_meaning_in_block(body[bed.end():])
            if not meaning:
                continue
            rank = _WORTART_PRIORITY.get(wortart, 15)
            candidates.append((rank, meaning))

    if not candidates:
        return None
    candidates.sort(key=lambda pair: pair[0])
    return candidates[0][1]


# --- Main workflow --------------------------------------------------------

def candidate_titles(lemma: str) -> list[str]:
    """Wiktionary pages are case-sensitive and nouns are capitalised."""
    seen: list[str] = []
    for t in (lemma, lemma.capitalize(), lemma.upper(), lemma.lower()):
        if t and t not in seen:
            seen.append(t)
    return seen


# Suffixes to try stripping when a page is missing. Longest first.
_INFLECTION_SUFFIXES = (
    "innen", "ungen", "enden", "enden", "enen",
    "ern", "tes", "ten", "tem", "ter", "tes",
    "sten", "ste", "end",
    "es", "em", "er", "en", "ne",
    "s", "n", "e",
)


def inflection_candidates(lemma: str) -> list[str]:
    base = lemma.strip()
    out: list[str] = []
    for suf in _INFLECTION_SUFFIXES:
        if len(base) > len(suf) + 2 and base.lower().endswith(suf):
            stem = base[: -len(suf)]
            for variant in (stem, stem + "e", stem + "en"):
                if variant not in out:
                    out.append(variant)
    return out


_GRUNDFORM_RE = re.compile(r"\{\{\s*Grundformverweis[^}]*?\|\s*([^|}\s]+)\s*[|}]")
_PARTIZIP_BASE_RE = re.compile(r"Partizip\s+(?:Perfekt|Präsens|I|II)\s+(?:des\s+Verbs\s+)?'{2,3}\s*\[\[\s*([^\[\]|]+?)\s*\]\]")


def follow_grundform(wikitext: str) -> str | None:
    m = _GRUNDFORM_RE.search(wikitext) or _PARTIZIP_BASE_RE.search(wikitext)
    if not m:
        return None
    return m.group(1).strip()


def resolve_description(lemma: str, sleep: float, depth: int = 0) -> str | None:
    if depth > 2:
        return None

    tried: set[str] = set()
    for title in candidate_titles(lemma):
        if title in tried:
            continue
        tried.add(title)
        wt = fetch_wikitext(title)
        time.sleep(sleep)
        if not wt:
            continue
        meaning = extract_first_meaning(wt)
        if meaning:
            return meaning
        # Page exists but no direct meaning — maybe it points to a base form.
        base = follow_grundform(wt)
        if base and base.lower() != lemma.lower():
            resolved = resolve_description(base, sleep, depth + 1)
            if resolved:
                return resolved

    # Last resort: try stripping common inflection suffixes.
    for candidate in inflection_candidates(lemma):
        if candidate in tried:
            continue
        tried.add(candidate)
        resolved = resolve_description(candidate, sleep, depth + 1)
        if resolved:
            return resolved
    return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0, help="Only process first N candidates (0 = all).")
    parser.add_argument("--sleep", type=float, default=0.15, help="Seconds between API calls.")
    parser.add_argument("--dry-run", action="store_true", help="Do not write dictionary.json back.")
    parser.add_argument("--only", nargs="*", default=None, help="Only process these specific lemmas (debug).")
    parser.add_argument("--report", type=str, default=None, help="Write failure report JSON here.")
    args = parser.parse_args()

    with DICT_PATH.open(encoding="utf-8") as fh:
        data = json.load(fh)

    lemmas = [
        k for k, v in data.items()
        if k != "aliases"
        and isinstance(v, dict)
        and "de" in v
        and isinstance(v["de"], dict)
        and (v["de"].get("description") or "").strip().lower() == k.strip().lower()
    ]
    if args.only:
        wanted = set(args.only)
        lemmas = [l for l in lemmas if l in wanted]
    if args.limit:
        lemmas = lemmas[: args.limit]

    print(f"[fill] candidates: {len(lemmas)}")
    filled = 0
    failed: list[str] = []

    for i, lemma in enumerate(lemmas, 1):
        description = resolve_description(lemma, args.sleep)

        if description:
            data[lemma]["de"]["description"] = description
            filled += 1
            if i % 25 == 0 or i <= 10:
                preview = description if len(description) <= 90 else description[:87] + "..."
                print(f"[{i}/{len(lemmas)}] {lemma}: {preview}")
        else:
            failed.append(lemma)
            if i % 25 == 0 or i <= 10:
                print(f"[{i}/{len(lemmas)}] {lemma}: <no definition found>")

        time.sleep(args.sleep)

    print(f"[fill] filled={filled} failed={len(failed)}")

    if args.report:
        Path(args.report).write_text(
            json.dumps({"filled": filled, "failed": failed}, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    if not args.dry_run:
        with DICT_PATH.open("w", encoding="utf-8") as fh:
            json.dump(data, fh, ensure_ascii=False, indent=2)
            fh.write("\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())
