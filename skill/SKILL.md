---
name: grazy
description: grazy - Your Grazer Command Line Companion. Verwende für alle Graz-bezogenen Infos: Öffi, Wetter, News, Luftqualität, POI-Suche, Events
---

# grazy Skill

Dieser Skill ermöglicht den Zugriff auf die grazy CLI für Grazer Stadt-Informationen.

## ⚠️ WICHTIG FÜR AGENTS

**Der Agent soll bei Unsicherheit IMMER zuerst `grazy help` aufrufen um alle Möglichkeiten zu sehen!**

```bash
# IMMER zuerst help aufrufen wenn du unsicher bist!
grazy help

# Oder für spezifische Commands:
grazy events --category help
grazy events --when help
grazy poi help
```

## Installation

Die CLI ist bereits global installiert: `npm install -g @grazy/cli`

## Commands

### 🚇 Öffentlicher Verkehr
```
grazy departures <stop>     # Echtzeit-Abfahrten
grazy search <name>          # Haltestelle suchen
grazy route <von> <nach>    # Route planen
```

### 🌤️ Wetter & Luftqualität
```
grazy weather                # Aktuelles Wetter
grazy weather --days 7       # 7-Tage Forecast
grazy air                   # Luftqualität (AQI, PM2.5, PM10)
```

### 📰 News
```
grazy news                   # Alle News (ORF + Kleine Zeitung)
grazy news --source orf     # Nur ORF
grazy news --source kleine  # Nur Kleine Zeitung
grazy news --source sport   # Nur Sport
```

### 📅 Events
```
grazy events                 # Alle Events (kultur.graz.at)
grazy events --category musik          # Nur Musik
grazy events --category theater        # Theater & Tanz
grazy events --category ausstellungen  # Ausstellungen
grazy events --category kabarett       # Kabarett
grazy events --category kinder         # Kinder & Jugend
grazy events --category lesungen       # Lesungen & Vorträge
grazy events --category fuehrungen      # Führungen
grazy events --category film           # Film & Neue Medien

grazy events --when heute      # Heute
grazy events --when morgen     # Morgen
grazy events --when woche     # Diese Woche
grazy events --when wochenende # Wochenende (Sa/So)
grazy events --when monat      # Diesen Monat

grazy events --category help   # Alle Kategorien anzeigen
grazy events --when help      # Alle Zeitfilter anzeigen

# Kombiniert:
grazy events -c musik -w wochenende
grazy events -c theater -w woche
```

### 🔍 POI-Suche
```
grazy poi <type>            # POI-Typ suchen
grazy poi help              # Alle verfügbaren Typen anzeigen
```

**Verfügbare POI-Typen:** restaurant, cafe, bar, fast_food, pub, cinema, theatre, museum, library, pharmacy, hospital, doctors, parking, fuel, atm, bank, playground

### 📋 Sonstiges
```
grazy status                # API-Status prüfen
grazy help                  # Hilfe anzeigen
```

## Bekannte Haltestellen (für Öffi)

- `Jakomini` → Jakominiplatz
- `FH Joanneum` / `FH` → FH Joanneum
- `Hauptbahnhof` / `Bahnhof` → Graz Hauptbahnhof
- `Stadion` → Merkur Arena
- `LKH` / `Med Uni` → LKH Med Uni

## Nutzung als Assistant - WICHTIG

### ⚡ Erster Schritt: IMMER help aufrufen!

```bash
# Bei ANY Unsicherheit - zuerst help!
grazy help

# Für Events:
grazy events --category help
grazy events --when help

# Für POI:
grazy poi help
```

### Dann Commands nutzen

```bash
# Events
grazy events --limit 10
grazy events --category musik
grazy events --when wochenende
grazy events -c theater -w wochenende

# Wetter
grazy weather

# Öffi
grazy departures "Jakomini"
grazy departures "FH Joanneum"

# News
grazy news --limit 5

# Luft
grazy air

# POI
grazy poi restaurant --limit 10
grazy poi cafe --limit 5
grazy poi pharmacy
```

## Output-Format

- **●** = Echtzeit-Daten verfügbar
- **+Xmin** = Verspätung
- AQI: 0-50 Gut, 51-100 Moderat, >100 Ungesund

## Wichtig

- **Immer English Commands verwenden** (departures, weather, news, poi, events, etc.)
- **BEI UNSICHERHEIT: grazy help aufrufen!**
- grazy ist keyless (keine API-Keys nötig)
- Daten kommen von: EFA, Open-Meteo, ORF RSS, OpenStreetMap, kultur.graz.at RSS
