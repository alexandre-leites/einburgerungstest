# Data pipeline

The app's two big assets — `docs/assets/questions.json` and
`docs/assets/dictionary.json` — are **generated artefacts**. Treat them as
outputs that can be rebuilt from source-of-truth inputs, not hand-editable
files.

```
data/
├── source/
│   ├── questions-raw.json       (current questions.json, the baseline data)
│   └── corrections.json          (sub_category overrides applied by scripts/update_questions.js)
└── (no generated/ dir — outputs land directly in docs/assets/)
```

## Rebuilding artefacts

```bash
./scripts/build-data.sh
```

What it runs:

1. `node scripts/update_questions.js` — applies `data/source/corrections.json`
   on top of `data/source/questions-raw.json` and writes
   `docs/assets/questions.json`.
2. `python3 scripts/fill_de_descriptions.py` — for every dictionary entry
   where the German `description` equals the lemma itself, fetches a real
   definition from de.wiktionary.org and updates
   `docs/assets/dictionary.json` in place.

Step 2 is network-bound and intentionally slow (it sleeps between requests
to be a polite Wiktionary client). Skip it unless you're doing a dictionary
refresh.

## When to rebuild

| You changed…                   | Rerun                          |
| ------------------------------ | ------------------------------ |
| `data/source/corrections.json` | `node scripts/update_questions.js` |
| A question in `questions-raw.json` | `node scripts/update_questions.js` |
| Nothing in dictionary source   | (don't rerun the Python script) |

## Migration checklist

If you rename a question ID, a sub_category, or otherwise change the shape
of `questions.json`, add a migration step in `docs/scripts/migrations.js`
so existing users' saved stats and in-flight sessions are remapped. Never
ship a schema change without a migration — see
`docs/scripts/migrations.js` for the framework.

## Dictionary quality note

About 1500 of the 1951 dictionary entries still have their German
`description` field equal to the lemma itself. The renderer hides those and
falls back to the EN/PT tab, but long-term you want to run
`scripts/fill_de_descriptions.py` to populate real DE definitions. There
is also a `.bak` of the last known-good dictionary under
`docs/assets/dictionary.json.bak` (git-ignored) which you can diff against.
