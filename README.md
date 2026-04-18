# Einbürgerungstest Self Learning Tool

A web-based application designed to help prepare for the German citizenship test (Einbürgerungstest) through interactive learning modes and multilingual support.

## 🎯 What is this project?

This is a self-learning platform for the German naturalization test (Einbürgerungstest). It provides an interactive way to study the official test questions, track your progress, and build your German vocabulary through various learning modes.

The application runs entirely in your browser with no backend required - just open and start learning!

## ✨ Features

### Learning Modes
- **Memorization Mode**: Study questions in random or ordered sequence (by ID)
- **Training Mode**: Practice with immediate feedback
- **Test Mode**: Simulate the actual exam with timer and state-specific questions
- **Review Mode**: Go over questions you've already studied

### Personalization & Tools
- **Multilingual Support**: Full interface and questions available in German (DE), English (EN), and Portuguese (PT-BR)
- **Personal Dictionary**: Build your own vocabulary by saving words from questions
- **Word Lookup**: Built-in dictionary with translations and word forms
- **Statistics Dashboard**: Track your progress and performance over time
- **State-Specific Questions**: Configure questions specific to your German state (Bundesland)

### User Experience
- **Progress Tracking**: Monitor how many questions you've completed
- **Session Persistence**: Your progress and settings are saved locally
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Capable**: Once loaded, works without internet connection

## 🚀 Getting Started

### Live Demo

Try the application online: **[https://alexandre-leites.github.io/einburgerungstest/#/home](https://alexandre-leites.github.io/einburgerungstest/#/home)**

### Running Locally

**On macOS/Linux:**
```bash
./start.sh
```

**On Windows:**
```bash
start.bat
```

**Alternative (Python 3 required):**
```bash
cd docs
python3 -m http.server 8976
# Then open http://localhost:8976 in your browser
```

The application will automatically open in your default browser at `http://localhost:8976`.

## 📁 Project Structure

```
einburgerungstest/
├── docs/                              # Everything served as static files (GitHub Pages)
│   ├── index.html                     # Main application
│   ├── assets/
│   │   ├── questions.json             # (generated) test questions
│   │   ├── dictionary.json            # (generated) German word dictionary
│   │   └── i18n/{de,en,pt}.json       # UI translations (source of truth)
│   ├── images/                        # Question images
│   ├── scripts/
│   │   ├── utils.js                   # Pure helpers (testable from Node)
│   │   ├── storage.js                 # localStorage wrapper
│   │   ├── migrations.js              # User-data schema migrations
│   │   ├── validation.js              # Runtime schema guards for question/dictionary data
│   │   ├── i18n.js                    # Translation loader
│   │   ├── stats-store.js             # Per-question stats
│   │   ├── mydict-store.js            # Personal dictionary
│   │   ├── session-store.js           # Session + test history I/O
│   │   ├── router.js                  # Hash-route dispatch table
│   │   ├── modes/                     # (future) per-mode renderers
│   │   ├── types.js                   # Shared JSDoc typedefs
│   │   ├── globals.d.ts               # Ambient EBT namespace declaration
│   │   └── general.js                 # App core (state, events, renderers)
│   └── styles/general.css
├── data/
│   ├── README.md                      # How to rebuild artefacts
│   └── source/
│       ├── questions-raw.json         # Source-of-truth questions
│       └── corrections.json           # sub_category / text overrides
├── scripts/
│   ├── build-data.sh                  # Orchestrator
│   ├── update_questions.js            # Corrections applier (Node, CJS)
│   ├── fill_de_descriptions.py        # Dictionary filler from de.wiktionary
│   └── check_i18n.mjs                 # Translation coverage check
├── tests/                             # Vitest suite for pure helpers
├── .github/workflows/ci.yml           # Lint + typecheck + i18n check + tests
├── package.json                       # Dev tooling (eslint, prettier, vitest, tsc)
├── jsconfig.json                      # JSDoc typecheck config
├── .eslintrc.json, .prettierrc.json, .editorconfig
├── start.sh / start.bat               # Local launcher
└── LICENSE
```

## 🛠 Development

```bash
npm install           # install dev tooling
npm run dev           # serve docs/ on :8976
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit (JSDoc-based)
npm run test          # Vitest
npm run check:i18n    # translation coverage
npm run check         # run everything CI runs
./scripts/build-data.sh   # rebuild generated JSON from data/source/
```

## ⚠️ Important Disclaimers

### Development Notice
Even though I am a software engineer, I "vibe coded" this project to help me personally prepare for the Einbürgerungstest. This means:
- **No guarantees**: The code was written quickly by AI for personal use, not production standards
- **Use at your own risk**: While functional, the application may contain bugs or edge cases
- **No warranty**: This is provided as-is without any guarantees of accuracy or completeness

### Content Accuracy
**The translations and dictionary entries have NOT been professionally verified.**
- All translations (EN/PT) were generated quickly and may contain errors or inaccuracies
- The German word dictionary is automatically generated and may have incorrect or missing entries
- Always verify important information with official sources
- For the official test preparation, refer to the [Bundesamt für Migration und Flüchtlinge (BAMF)](https://www.bamf.de)

### Image Rights & Copyright
**No copyright ownership is claimed for any images in this repository.**
- The question images (`docs/images/`) may be subject to copyright by their respective owners
- Images are included solely for educational and study purposes
- This project is intended for **personal study use only**, not for commercial purposes
- No copyright infringement is intended - if you are a rights holder and have concerns, please open an issue

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests for improvements
- Share feedback on translations or content accuracy

## 📝 License

See [LICENSE](LICENSE) file for details.

---

**Note**: This application is an unofficial study tool and is not affiliated with, endorsed by, or connected to the German government or BAMF. For official information about the Einbürgerungstest, please visit [bamf.de](https://www.bamf.de).
