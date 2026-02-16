#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const { departuresCmd, searchCmd, routeCmd, statusCmd } = require('./commands');
const { weatherCmd } = require('./commands/weather');
const { eventsCmd } = require('./commands/events');
const { newsCmd } = require('./commands/news');
const { airCmd } = require('./commands/air');
const { poiCmd } = require('./commands/poi');

const program = new Command();

program
  .name('grazy')
  .description('grazy - Your Grazer Command Line Companion 🧡🚇')
  .version('0.4.0');

// Search (stops)
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

// Air Quality
program
  .command('air')
  .alias('a')
  .description('Get air quality index for Graz')
  .action(airCmd);

// News
program
  .command('news')
  .alias('n')
  .description('Get latest news from Graz')
  .option('-s, --source <source>', 'Source: orf, kleine, sport')
  .option('-l, --limit <n>', 'Number of articles', '10')
  .action(newsCmd);

// POI Search
program
  .command('poi <type>')
  .description('Search POIs (restaurants, cafes, bars, etc.)')
  .option('-l, --limit <n>', 'Number of results', '10')
  .action(poiCmd);

// Events (placeholder)
program
  .command('events')
  .alias('e')
  .description('Get upcoming events in Graz (coming soon)')
  .option('-c, --category <cat>', 'Filter by category')
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
    
    console.log(chalk.cyan('🌤️  Weather & Air:'));
    console.log('  grazy weather              Current weather');
    console.log('  grazy air                 Air quality\n');
    
    console.log(chalk.cyan('📰 News:'));
    console.log('  grazy news                All news');
    console.log('  grazy news --source orf   ORF only\n');
    
    console.log(chalk.cyan('🔍 POI Search:'));
    console.log('  grazy poi <type>          Search places');
    console.log('  grazy poi help            Show types\n');
    
    console.log(chalk.cyan('Options:'));
    console.log('  -l, --limit <n>     Number of results');
    console.log('  -L, --line <nr>     Filter by line\n');
    
    console.log(chalk.cyan('Examples:'));
    console.log('  grazy departures "Jakomini"');
    console.log('  grazy weather');
    console.log('  grazy news');
    console.log('  grazy poi restaurant');
    console.log('  grazy poi cafe');
    console.log();
  });

program.parse();
