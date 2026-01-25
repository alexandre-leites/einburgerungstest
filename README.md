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
einburgerungstest-memorization/
├── docs/
│   ├── index.html              # Main application file
│   ├── assets/
│   │   ├── questions.json      # All test questions with translations
│   │   └── dictionary.json     # German word dictionary
│   ├── images/                 # Question images
│   ├── scripts/
│   │   └── general.js          # Application logic
│   └── styles/
│       └── general.css         # Styling
├── start.sh                    # Launch script for macOS/Linux
└── start.bat                   # Launch script for Windows
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
