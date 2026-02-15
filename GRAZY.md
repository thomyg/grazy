# GRAZY.md - grazy Identity & Development Guide

> Last Updated: 2026-02-15

---

## Identity

| Field | Value |
|-------|-------|
| **Name** | grazy |
| **Pronounced** | like "crazy" 🧡 |
| **Vibe** | Fast, helpful, no-nonsense |
| **Emoji** | 🧡 (Steiermark Herz) |

---

## Purpose

grazy brings Graz to your terminal. Starting with public transport, expanding to all things Graz:

- 🚇 Public transport (Öffi)
- 🌤️ Weather
- 📅 Events
- 🗑️ Trash collection
- 🅿️ Parking
- ⚽ Stadium/Games

**Core Principle:** Everything local, useful, and fast.

---

## Development Rules

### 1. Commands: ALWAYS English
✅ `grazy search "Stadion"`  
✅ `grazy departures "FH Joanneum"`  
❌ `grazy suche "Stadion"`

All user-facing text, commands, outputs, and documentation **MUST** be in English.

### 2. Code Structure
```
src/
├── index.js          # CLI entry, commander setup
├── commands/         # Command implementations
│   └── index.js
├── lib/              # API clients & helpers
│   ├── efa.js        # EFA API client
│   └── knownStops.js # Stop-ID mappings
└── ...
```

### 3. Package Publishing
- **npm org:** `@grazy`
- **Package name:** `@grazy/cli`
- **Versioning:** SemVer (v0.1.0, v0.2.0, etc.)
- **CI/CD:** GitHub Actions → npm publish on tag

### 4. API Source
[EFA Verbund Linie](https://efa.verbundlinie.at:8443/stv/)
- Public, no auth required
- Provides real-time departures
- Stop-IDs for Graz area

---

## Commands Reference

| Command | Alias | Description |
|---------|-------|-------------|
| `search <name>` | `s` | Find stop by name |
| `departures <stop>` | `dep` | Real-time departures |
| `route <from> <to>` | `r` | Find route A → B |
| `stadium` | - | Directions to Merkur Arena |
| `status` | - | Check API health |
| `help` | - | Show help |

### Common Options

| Option | Description |
|--------|-------------|
| `-l, --limit <n>` | Number of results |
| `-L, --line <nr>` | Filter by line |
| `-r, --direction` | Filter by direction |
| `-t, --type` | tram or bus |

---

## Known Stops (for Development)

| Stop | Stop-ID | Notes |
|------|---------|-------|
| FH Joanneum | 63207960 | University |
| Hauptbahnhof | 63203040 | Main Station |
| Stadion | 63203198 | Münzgrabenstraße |
| Stadion Liebenau | 63203023 | Near stadium |
| LKH Med Uni | 63203001 | Medical University |
| Jakominiplatz | 63203010 | Central hub |

---

## Agent/Developer Notes

### How to Test Changes
```bash
# Local link
npm link
grazy --help

# Test specific command
grazy departures "FH Joanneum"
```

### Publishing New Version
```bash
# Update version in package.json
git add .
git commit -m "Description"
git tag v0.X.X
git push --tags
```

### Debugging
- EFA API returns raw JSON - use `--json` flag (future)
- Check `grazy status` for API health
- Known stops can bypass search (faster)

### Output Conventions
- **●** = Real-time data available
- **+Xmin** = Delay (e.g., "+2min")
- Transport types: Straßenbahn (tram), Stadtbus, RegioBus, Nachtbus

---

## Roadmap

- [ ] Route planning (A → B)
- [ ] Weather command
- [ ] Events command
- [ ] Trash collection
- [ ] Parking info
- [ ] Stadium match day mode
- [ ] Tests (Jest)
- [ ] Auto-update check

---

## Contact

- **GitHub:** https://github.com/thomyg/grazy
- **npm:** https://npmjs.com/@grazy/cli
- **Author:** Thomas Gölles

---

*grazy - made with 🧡 in Graz*
