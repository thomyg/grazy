# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2026-02-15

### Added
- Extended known stops for fuzzy matching (Jakomini, etc.)
- Fallback search when API returns empty results

### Fixed
- Search now works with partial stop names via known stops fallback

## [0.3.0] - 2026-02-15

### Added
- `grazy weather` - Current weather and forecast for Graz (Open-Meteo API)
- `grazy events` - Events placeholder (coming soon)
- All commands now in English

### Changed
- Updated help text
- Version bump to 0.3.0

## [0.2.0] - 2026-02-15

### Added
- All commands now in English
- AGENT.md for assistant knowledge base

### Changed
- English command names (search, departures, route, etc.)
- Updated outputs to English

## [0.1.0] - 2026-02-15

### Added
- `grazy search <name>` - Search for stops
- `grazy departures <stop>` - Real-time departures
- `grazy route <from> <to>` - Route planning
- `grazy stadium` - Directions to stadium
- `grazy status` - API health check
- `grazy help` - Help text

### Initial Release
- EFA API integration for Graz public transport
- Known stops mapping (FH Joanneum, Hauptbahnhof, Stadion, etc.)
