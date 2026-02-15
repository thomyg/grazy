#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const { departuresCmd, searchCmd, routeCmd, statusCmd } = require('./commands');
const { weatherCmd } = require('./commands/weather');
const { eventsCmd } = require('./commands/events');

const program = new Command();

program
  .name('grazy')
  .description('grazy - Your Grazer Command Line Companion 🧡🚇')
  .version('0.3.0');

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

// Weather
program
  .command('weather')
  .alias('w')
  .description('Get current weather in Graz')
  .option('-d, --days <n>', 'Forecast days (1-7)', '3')
  .action(weatherCmd);

// Events
program
  .command('events')
  .alias('e')
  .description('Get upcoming events in Graz')
  .option('-c, --category <cat>', 'Filter by category (all, concert, theater, exhibition, market, sports, kids)')
  .option('-l, --limit <n>', 'Number of events', '10')
  .action(eventsCmd);

// Status
program
  .command('status')
  .description('Check API status')
  .action(statusCmd);

// Help
program
  .command('help')
  .description('Show helpful tips')
  .action(() => {
    console.log(chalk.bold('\n📖 grazy - Help\n'));
    
    console.log(chalk.cyan('🚇 Transport:'));
    console.log('  grazy search <name>        Find a stop');
    console.log('  grazy departures <stop>    Next departures');
    console.log('  grazy route <from> <to>    Find route\n');
    
    console.log(chalk.cyan('🌤️  Weather & Events:'));
    console.log('  grazy weather              Current weather');
    console.log('  grazy weather --days 7     7-day forecast');
    console.log('  grazy events               Upcoming events\n');
    
    console.log(chalk.cyan('Options:'));
    console.log('  -l, --limit <n>     Number of results');
    console.log('  -L, --line <nr>     Filter by line');
    console.log('  -t, --type          tram or bus\n');
    
    console.log(chalk.cyan('Examples:'));
    console.log('  grazy departures "FH Joanneum"');
    console.log('  grazy weather');
    console.log('  grazy events --category concert');
    console.log();
  });

program.parse();
