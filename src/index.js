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
  .version('0.5.0');

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
  .option('-n, --near <address>', 'Search near address (e.g., "Jakominiplatz")')
  .option('-r, --radius <m>', 'Search radius in meters (default: 1000)', '1000')
  .action(poiCmd);

// Events
program
  .command('events')
  .alias('e')
  .description('Get upcoming events in Graz')
  .option('-c, --category <cat>', 'Filter by category (musik, theater, ausstellungen, kabarett, kinder, lesungen, fuehrungen, film, hinweise, all)')
  .option('-w, --when <zeit>', 'Filter by time (heute, morgen, woche, wochenende, monat)')
  .option('-l, --limit <n>', 'Number of events', '15')
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
    console.log('  grazy poi <type>          Search places in Graz');
    console.log('  grazy poi <type> --near "ADDRESS"  Search near address');
    console.log('  grazy poi help            Show types\n');
    
    console.log(chalk.cyan('📅 Events:'));
    console.log('  grazy events              Alle Events');
    console.log('  grazy events --category musik    Nur Musik');
    console.log('  grazy events --when heute        Heute');
    console.log('  grazy events -c theater -w wochenende  Theater am Wochenende\n');
    
    console.log(chalk.cyan('Options:'));
    console.log('  -l, --limit <n>     Number of results');
    console.log('  -n, --near <addr>   Search near address');
    console.log('  -r, --radius <m>    Search radius (default: 1000m)\n');
    
    console.log(chalk.cyan('Examples:'));
    console.log('  grazy departures "Jakomini"');
    console.log('  grazy weather');
    console.log('  grazy news');
    console.log('  grazy poi restaurant');
    console.log('  grazy poi cafe --near "Eggenberg"');
    console.log('  grazy poi bar --near "Jakominiplatz" --radius 500');
    console.log('  grazy events');
    console.log('  grazy events --category musik');
    console.log('  grazy events --when heute');
    console.log('  grazy events -c theater -w wochenende');
    console.log();
  });

program.parse();
