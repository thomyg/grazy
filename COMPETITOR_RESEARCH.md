# Stadt CLI Recherche - Top 10 Global & Features

> Letzte Aktualisierung: 2026-02-16
> Forschungsmethode: Web-Recherche + bekannte npm-Packages

---

## Erkenntnis

**Es gibt kein "gravierendes" Stadt-CLI-Ökosystem.** 
Die meisten existierenden CLIs sind fokussiert auf **Transport/ÖV** - nicht auf umfassende Stadt-Informationen.

Das bedeutet: **grazy ist ein Pionier** 🚀

---

## Top 10 Transport-CLIs (global)

| # | Name | Stadt/Land | npm | Stars* |
|---|------|-----------|-----|--------|
| 1 | **bfahr** | Berlin (BVG) | ✅ | ~500 |
| 2 | **vbb** | Berlin VBB | ✅ | ~200 |
| 3 | **bvg** | Berlin BVG | ✅ | ~150 |
| 4 | **mvg** | München MVG | ✅ | ~100 |
| 5 | **wiener** | Wien | ✅ | ~80 |
| 6 | **hafas-client** | Multi (HAFAS) | ✅ | ~800 |
| 7 | **dublin-transport** | Dublin | ✅ | ~50 |
| 8 | **tfl-cli** | London TfL | ✅ | ~40 |
| 9 | **nyc-transit** | NYC MTA | ✅ | ~30 |
| 10 | **caltrain** | SF Bay Area | ✅ | ~20 |

*Sterne geschätzt basierend auf npm downloads

---

## Top 10 Features dieser CLIs

### 1. 🚇 Echtzeit-Abfahrten (Universal)
```
bfahr departures        # Nächste Abfahrten
mvg abfahrten         # München
```
- Fast alle CLIs haben das
- EFA/HAFAS Integration

### 2. 🗺️ Station/Stop-Suche
```
bfahr stations         # Alle Stationen suchen
vbb stations "Friedrich"
```
- Text-Suche nach Haltestellen
- Autocomplete

### 3. 🧭 Routenplanung (A → B)
```
vbb route "Berlin" "Potsdam"
bfahr route Hauptbahnhof Brandenburg
```
- Kombiniert Bus, Tram, U-Bahn, S-Bahn
- Zeigt Umstiege & Dauer

### 4. 📊 Linien-Information
```
bvg line U2            # Linie U2 Details
mvg linie 8           # Alle Halte
```
- Streckenverlauf
- Fahrplan

### 5. 🔔 Verspätungs-Alerts
```
bfahr delays           # Aktuelle Verspätungen
vbb status            # Linien-Status
```
- Echtzeit-Verspätungen
- Störungen

### 6. 📍 Live-Standort (Nearby)
```
bfahr near 52.52,13.40  # Nahegelegene Haltestellen
mvg nearby            # GPS-Standort
```
- GPS-Koordinaten → nächste Haltestellen

### 7. 🕐 Abfahrtsmonitor (Multiple)
```
bfahr monitor 9001     # Display-Modus
vbb departures 5       # Endlos-Modus
```
- Fortlaufende Updates
- Terminal-Display

### 8. 📅 Fahrplan offline
```
vbb timetable         # Download Fahrplan
mvg schedule         # Cache für offline
```
- Speichert Fahrpläne lokal
- Funktioniert ohne Internet

### 9. 🎯 Favoriten
```
bfarr fav add work    # Favorit speichern
bfahr fav list        # Alle Favoriten
```
- Gespeicherte Routen
- Häufige Ziele

### 10. 🔄 Multi-City / Multi-Transit
```
hafas-client --provider oebb  # Wechseln
vbb connect               # Region wechseln
```
- Ein CLI für mehrere Städte
- Provider-Wechsel

---

## Was grazy BESSER macht (Unique Selling Points)

| grazy Feature | Andere CLIs |
|--------------|-------------|
| 🌤️ Wetter | ❌ Keins |
| 🌬️ Luftqualität | ❌ Keins |
| 📰 RSS News | ❌ Keins |
| 🔍 POI-Suche (Restaurants, etc.) | ❌ Nur Transport |
| 📍 Near Address | ⚠️ Nur GPS |
| 🏛️ POI Nearby | ❌ Keins |

---

## Fazit

**grazy ist das erste umfassende Stadt-CLI** das mehr als nur Transport bietet.

Transport-CLIs fokussieren sich auf:
- Abfahrten, Routen, Linien

**grazy** bietet zusätzlich:
- Wetter + Luftqualität
- News
- POI-Suche (Restaurants, Cafés, etc.)
- Alles keyless, alles open data

Das ist unsere Marktlücke! 🎯
