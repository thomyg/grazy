#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const { departuresCmd, searchCmd, routeCmd, statusCmd } = require('./commands');

const program = new Command();

program
  .name('grazy')
  .description('grazy - Your Grazer Command Line Companion 🧡🚇')
  .version('1.0.0');

// Suchen
program
  .command('suche <name>')
  .description('Haltestelle nach Namen suchen')
  .action(searchCmd);

// Abfahrten
program
  .command('abfahrt <stopp>')
  .alias('ab')
  .description('Echtzeit-Abfahrten an einer Haltestelle')
  .option('-l, --limit <n>', 'Anzahl der Abfahrten', '10')
  .option('-L, --linie <nr>', 'Nach Linie filtern')
  .option('-r, --richtung <text>', 'Nach Richtung filtern')
  .option('-t, --type <tram|bus>', 'Nach Verkehrsmittel filtern')
  .action(departuresCmd);

// Route
program
  .command('route <von> <nach>')
  .alias('r')
  .description('Verbindung von A nach B suchen')
  .option('-a, --arrival', 'Ankunftszeit angeben statt Abfahrtszeit')
  .option('-d, --departure', 'Abfahrtszeit angeben (Standard)', { default: true })
  .option('-c, --changes <n>', 'Max. Umstiege', '5')
  .action(routeCmd);

// Stadion (Beispiel für preset)
program
  .command('stadion')
  .description('Verbindung zum Stadion (Merkur Arena)')
  .option('-v, --von <ort>', 'Startort', 'Hauptbahnhof')
  .action(async (options) => {
    const { von } = options;
    await routeCmd(von, 'Stadion Graz', { departure: true });
  });

// Status
program
  .command('status')
  .description('API-Status prüfen')
  .action(statusCmd);

// Hilfe-Tipps für mich
program
  .command('hilfe')
  .description('Zeigt hilfreiche Tipps für den Assistant')
  .action(() => {
    console.log(chalk.bold('\n📖 Graz Öffi CLI - Hilfe\n'));
    
    console.log(chalk.cyan('Befehle:'));
    console.log('  grazoeffi suche <name>     Haltestelle finden');
    console.log('  grazoeffi abfahrt <stopp>  Nächste Abfahrten');
    console.log('  grazoeffi route <von> <nach>  Route suchen');
    console.log('  grazoeffi stadion          Zum Stadion');
    console.log('  grazoeffi status           API-Status\n');
    
    console.log(chalk.cyan('Optionen:'));
    console.log('  -l, --limit <n>    Anzahl Abfahrten');
    console.log('  -L, --linie <nr>   Nur bestimmte Linie');
    console.log('  -r, --richtung     Nur Richtung filtern');
    console.log('  -t, --type         tram oder bus\n');
    
    console.log(chalk.cyan('Beispiele für Assistant:'));
    console.log('  "Abfahrt FH Joanneum"');
    console.log('  "Suche Stadion"');
    console.log('  "Route Hauptbahnhof zum Stadion"');
    console.log('  "Linie 7 Abfahrt"');
    console.log();
    
    console.log(chalk.cyan('Bekannte Haltestellen-IDs:'));
    console.log('  63207960  FH Joanneum');
    console.log('  63203198  Stadion Münzgrabenstraße');
    console.log('  63203023  Stadion Liebenau');
    console.log('  6324001   Graz Hauptbahnhof');
    console.log();
  });

program.parse();
