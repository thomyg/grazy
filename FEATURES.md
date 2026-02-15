# grazy Feature Roadmap

> Research: Top 10 Features for grazy
> Status: In Progress
> Last Updated: 2026-02-15

---

## Top 10 Features (Proposed)

### 1. 🚇 Real-time Departures (DONE v0.2)
- Status: ✅ Implemented
- Command: `grazy departures <stop>`
- Source: EFA Verbund Linie API

### 2. 🚏 Stop Search (DONE v0.2)
- Status: ✅ Implemented
- Command: `grazy search <name>`

### 3. 🌤️ Weather (PLANNED v0.3)
- **Command:** `grazy weather`
- **API:** Open-Meteo (free, no key needed)
- **Data:** Temperature, precipitation, UV index, wind
- **Location:** Graz coordinates (47.0767° N, 15.4214° E)
- **Status:** 🔄 Implementing

### 4. 📅 Events (PLANNED v0.4)
- **Command:** `grazy events`
- **API:** Graz Open Data / scrapable
- **Data:** Concerts, exhibitions, markets, kids events
- **Status:** 🔄 Implementing

### 5. 👶 Family / Kids
- **Command:** `grazy kids`
- **Data:** Playgrounds, family events, children programs
- **Status:** 🔍 Research

### 6. 🚲 Citybike
- **Command:** `grazy bike`
- **API:** nextbike.net
- **Data:** Available bikes, stations
- **Status:** 🔍 Research

### 7. 🗑️ Trash Collection
- **Command:** `grazy trash`
- **Data:** Next pickup for Restmüll, Bio, Papier
- **Status:** 🔍 Research

### 8. 🅿️ Parking
- **Command:** `grazy parking`
- **Data:** Free spots in Parkhaus
- **Status:** 🔍 Research

### 9. 🏥 Emergency Info
- **Command:** `grazy emergency`
- **Data:** Emergency numbers, hospitals, pharmacies
- **Status:** 🔍 Research

### 10. 📊 City Stats
- **Command:** `grazy stats`
- **Data:** Air quality, traffic
- **Status:** 🔍 Research

---

## Confirmed Available APIs

| Service | API | Status |
|---------|-----|--------|
| Public Transport | efa.verbundlinie.at | ✅ Working |
| Weather | Open-Meteo.com | ✅ Free, no key |
| Citybike | nextbike.net | 🔍 Research |
| Events | data.graz.at | 🔍 Research |
| Air Quality | umweltbundesamt.at | 🔍 Research |

---

## Implementation Progress

- [x] v0.2: Departures + Search
- [ ] v0.3: Weather
- [ ] v0.4: Events
- [ ] v0.5: Citybike
- [ ] v0.6: Family/Kids
- [ ] v0.7: Trash
- [ ] v0.8: Parking
- [ ] v0.9: Emergency
- [ ] v1.0: City Stats

---

## Ideas for Later

- Restaurant search
- Supermarket hours
- Train connections (ÖBB)
- Flight departures (Graz Airport)
- Swimming pools
- Libraries
- Dog parks
- Local news
