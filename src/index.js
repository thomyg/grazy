#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const { departuresCmd, searchCmd, routeCmd, statusCmd } = require('./commands');

const program = new Command();

program
  .name('grazy')
  .description('grazy - Your Grazer Command Line Companion 🧡🚇')
  .version('0.1.0');

// Search
program
  .command('search <name>')
  .alias('s')
  .description('Search for stops by name')
  .action(searchCmd);

// Departures
program
  .command('departures <stop>')
  .alias('dep')
  .description('Real-time departures at a stop')
  .option('-l, --limit <n>', 'Number of departures', '10')
  .option('-L, --line <nr>', 'Filter by line number')
  .option('-r, --direction <text>', 'Filter by direction')
  .option('-t, --type <tram|bus>', 'Filter by transport type')
  .action(departuresCmd);

// Route
program
  .command('route <from> <to>')
  .alias('r')
  .description('Find route from A to B')
  .option('-a, --arrival', 'Specify arrival time instead of departure')
  .option('-d, --departure', 'Specify departure time (default)', { default: true })
  .option('-c, --changes <n>', 'Max transfers', '5')
  .action(routeCmd);

// Stadium
program
  .command('stadium')
  .description('Get directions to Merkur Arena (Stadion)')
  .option('-f, --from <place>', 'Start location', 'Hauptbahnhof')
  .action(async (options) => {
    const { from } = options;
    await routeCmd(from, 'Stadion', { departure: true });
  });

// Status
program
  .command('status')
  .description('Check API status')
  .action(statusCmd);

// Help
program
  .command('help')
  .description('Show helpful tips for the Assistant')
  .action(() => {
    console.log(chalk.bold('\n📖 grazy - Help\n'));
    
    console.log(chalk.cyan('Commands:'));
    console.log('  grazy search <name>        Find a stop');
    console.log('  grazy departures <stop>    Next departures');
    console.log('  grazy route <from> <to>    Find route');
    console.log('  grazy stadium               Directions to stadium');
    console.log('  grazy status               API status\n');
    
    console.log(chalk.cyan('Options:'));
    console.log('  -l, --limit <n>     Number of departures');
    console.log('  -L, --line <nr>     Filter by line');
    console.log('  -r, --direction     Filter by direction');
    console.log('  -t, --type          tram or bus\n');
    
    console.log(chalk.cyan('Examples:'));
    console.log('  grazy departures "FH Joanneum"');
    console.log('  grazy search "Stadion"');
    console.log('  grazy route "Hauptbahnhof" "Stadion"');
    console.log('  grazy departures "Stadion" --line 7');
    console.log();
    
    console.log(chalk.cyan('Known Stops:'));
    console.log('  63207960  FH Joanneum');
    console.log('  63203198  Stadion Münzgrabenstraße');
    console.log('  63203023  Stadion Liebenau');
    console.log('  63203040  Graz Hauptbahnhof');
    console.log();
  });

program.parse();
