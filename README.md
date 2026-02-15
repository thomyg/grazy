# grazy 🧡🚇

> Your Grazer Command Line Companion

**grazy** – ausgesprochen wie "crazy" – ist dein CLI-Tool für alles rund um Graz.

## Features

### 🚇 Öffi (Öffentlicher Verkehr)
- Echtzeit-Abfahrten an jeder Grazer Haltestelle
- Haltestellen-Suche
- Linien-Filter
- Echtzeit-Verspätungen (● = Live-Daten)

### 🚧 In Entwicklung
- Route planen
- Stadion-Anfahrt (Merkur Arena)
- Veranstaltungen
- Wetter
- Müllabfuhr

## Installation

```bash
# Klonen
git clone https://github.com/YOUR_USER/grazy.git
cd grazy

# Abhängigkeiten installieren
npm install

# Global verlinken
npm link

# Oder direkt starten
node src/index.js --help
```

## Usage

### Abfahrten
```bash
grazy abfahrt "FH Joanneum"
grazy abfahrt "Hauptbahnhof" --limit 10
grazy abfahrt "Stadion" --linie 7
```

### Suche
```bash
grazy suche "Stadion"
grazy suche "Hauptbahnhof"
```

### Hilfe
```bash
grazy hilfe
grazy status
```

## Bekannte Haltestellen

| Name | Stop-ID |
|------|---------|
| FH Joanneum | 63207960 |
| Hauptbahnhof | 63203040 |
| Stadion (Münzgrabenstraße) | 63203198 |
| Stadion Liebenau | 63203023 |
| LKH Med Uni | 63203001 |
| Jakominiplatz | 63203010 |

## API

Nutzt die offene EFA API von [Verbund Linie](https://verbundlinie.at).

## License

MIT

Made with---

 🧡 in Graz
