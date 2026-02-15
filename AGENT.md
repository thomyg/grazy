# grazy - Agent Knowledge Base

> Last Updated: 2026-02-15

## Was ist grazy?

**grazy** ist eine CLI für Grazer Alltagstools – öffentlicher Verkehr, Events, Stadt-Info.

**NPM Package:** `@grazy/cli`  
**GitHub:** https://github.com/thomyg/grazy  
**Registry:** npmjs.com/@grazy/cli

## Installation

```bash
npm install -g @grazy/cli
grazy --help
```

## Commands (English)

| Command | Alias | Description |
|---------|-------|-------------|
| `search <name>` | `s` | Search for stops by name |
| `departures <stop>` | `dep` | Real-time departures at a stop |
| `route <from> <to>` | `r` | Find route from A to B |
| `stadium` | - | Get to Merkur Arena |
| `status` | - | Check API status |
| `help` | - | Show help |

### Options

- `-l, --limit <n>` - Number of departures (default: 10)
- `-L, --line <nr>` - Filter by line number
- `-r, --direction <text>` - Filter by direction
- `-t, --type <tram|bus>` - Filter by transport type

## Known Stops (Stop-IDs)

| Stop Name | Stop-ID | Aliases |
|-----------|---------|---------|
| FH Joanneum | 63207960 | FH, Joanneum, University |
| Hauptbahnhof | 63203040 | Bahnhof, Main Station |
| Stadion (Münzgrabenstraße) | 63203198 | Stadion, Merkur Arena, Stadium |
| Stadion Liebenau | 63203023 | Liebenau |
| LKH Med Uni | 63203001 | Med Uni, Medical University |
| Jakominiplatz | 63203010 | Jakomini |

## Usage Examples for Agent

### "When does the next Tram 7 leave FH Joanneum?"
```bash
grazy departures "FH Joanneum" --line 7
```

### "Get departures at the stadium"
```bash
grazy departures "Stadion" --limit 10
```

### "Find a stop"
```bash
grazy search "Hauptbahnhof"
```

### "Is the API online?"
```bash
grazy status
```

## Output Format

- **●** = Real-time data available
- **+Xmin** = Delay (e.g., "+2min" = 2 minutes late)
- Transport types: Straßenbahn (tram), Stadtbus (city bus), RegioBus, Nachtbus (night bus)

## API Source

[EFA Verbund Linie](https://efa.verbundlinie.at:8443/stv/) - Public transport API for Styria, Austria.

## Future Features (Roadmap)

- [ ] Route planning (A → B)
- [ ] Weather (Graz specific)
- [ ] Events
- [ ] Müllabfuhr (trash collection)
- [ ] Parking info
- [ ] GAK match day transport

## Notes for Agent

- Always use English commands (search, departures, route, etc.)
- grazy is pronounced like "crazy" 🧡
- Graz, Austria is the home city
- EFA API provides real-time data with delays
- Stadium is "Merkur Arena" in Liebenau district
