# grazy - AGENT REFERENCE

> For AI Agents working with grazy project
> Last Updated: 2026-02-16

---

## 📦 Project: grazy - Your Grazer Command Line Companion

**NPM Package:** `@grazy/cli`  
**GitHub:** https://github.com/thomyg/grazy  
**Version:** 0.4.0

---

## 🎯 Purpose

grazy brings Graz to your terminal. A CLI tool for all things Graz:
- Public transport (Öffi)
- Weather
- Air quality
- News (RSS)
- POI search (Restaurants, cafes, etc.)

---

## 📁 Project Structure

```
~/grazy/                    # Main project
├── src/
│   ├── index.js           # CLI entry
│   ├── commands/           # Command implementations
│   │   ├── index.js
│   │   ├── weather.js
│   │   ├── air.js
│   │   ├── news.js
│   │   └── poi.js
│   └── lib/              # API clients
│       ├── efa.js        # Public transport API
│       ├── weather.js     # Open-Meteo
│       ├── airquality.js  # Air quality
│       ├── news.js       # RSS feeds
│       └── poi.js        # Overpass/OSM
├── tests/                 # Jest tests
│   ├── unit.test.js
│   └── integration.test.js
├── package.json
├── CHANGELOG.md
├── README.md
├── GRAZY.md              # Identity & dev guide (PRIVATE)
├── FEATURES.md           # Feature roadmap (PRIVATE)
└── AGENT.md             # This file
```

---

## 🔧 Development

### Install Local
```bash
cd ~/grazy
npm install
npm link  # Link globally
```

### Test
```bash
npm test
```

### Publish (CI/CD)
```bash
# Push to GitHub with tag
git tag v0.x.x
git push --tags

# GitHub Action publishes to npm automatically
```

---

## 📋 Commands Reference

| Command | Description |
|---------|-------------|
| `grazy search <name>` | Search for stops |
| `grazy departures <stop>` | Real-time departures |
| `grazy weather` | Current weather |
| `grazy air` | Air quality |
| `grazy news` | RSS news |
| `grazy events` | Events from kultur.graz.at |
| `grazy events --category musik` | Events by category |
| `grazy events --when wochenende` | Events filtered by time |
| `grazy poi <type>` | POI search |
| `grazy poi <type> --near <address> --radius <m>` | POI near address |
| `grazy status` | API status |

### POI Types
`restaurant`, `cafe`, `bar`, `fast_food`, `pub`, `cinema`, `theatre`, `museum`, `library`, `pharmacy`, `hospital`, `doctors`, `parking`, `fuel`, `atm`, `bank`, `playground`

---

## 🔑 API Sources

| Service | API | Key? |
|---------|-----|------|
| Public Transport | efa.verbundlinie.at | ❌ No |
| Weather | Open-Meteo | ❌ No |
| Air Quality | Open-Meteo | ❌ No |
| News | RSS (ORF, Kleine) | ❌ No |
| Events | kultur.graz.at RSS | ❌ No |
| POI | Overpass API (OSM) | ❌ No |

---

## 📅 Events Feature

Uses RSS feeds from kultur.graz.at:
- `grazy events` - All events
- `grazy events --category musik` - Filter by category
- `grazy events --when wochenende` - Filter by time
- `grazy events -c theater -w woche` - Combined filters

### Categories
`all`, `musik`, `theater`, `ausstellungen`, `kabarett`, `kinder`, `lesungen`, `fuehrungen`, `film`, `hinweise`

### Time Filters
`heute`, `morgen`, `woche`, `wochenende`, `monat`

---

## 🚀 OpenClaw Skill

For using grazy inside OpenClaw:

1. grazy CLI must be installed: `npm install -g @grazy/cli`
2. Use skill at: `/home/azureuser/.npm-global/lib/node_modules/openclaw/skills/grazy/`

### In OpenClaw
```bash
# Use grazy directly
grazy weather
grazy air "Jakomini"
grazy poi restaurant --near "Eggenberg"
```

---

## 🧪 Testing grazy

```bash
# Test specific command
grazy weather

# Test departures
grazy departures "Jakomini"

# Test news
grazy news --limit 5

# Test POI
grazy poi cafe --near "Jakomini" --radius 500
```

---

## 📝 Feature Ideas (for later)

See FEATURES.md for full roadmap:

- [x] Events API ✅ (v0.5.0)
- [ ] Route planning
- [ ] Citybike
- [ ] Emergency info
- [ ] Parking live
- [ ] Trash collection

---

## 🔗 Links

- **GitHub:** https://github.com/thomyg/grazy
- **NPM:** https://www.npmjs.com/package/@grazy/cli
- **Author:** Thomas Gölles (@thomyg)

---

*For internal agent use - do not share publicly*
