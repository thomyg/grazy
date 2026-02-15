const chalk = require('chalk');
const { searchStops, getDepartures, getRoutes, getStatus } = require('../lib/efa');

/**
 * Command: Departures at a stop
 */
async function departuresCmd(stop, options) {
  try {
    const deps = await getDepartures(stop, {
      limit: options.limit || 10,
      line: options.line,
      direction: options.direction,
      type: options.type
    });
    
    if (deps.length === 0) {
      console.log(chalk.yellow('No departures found.'));
      return;
    }
    
    console.log(chalk.bold(`\n🚌 Departures from "${stop}":\n`));
    console.log(chalk.gray('─'.repeat(60)));
    
    for (const d of deps) {
      const time = d.realTime || d.scheduledTime;
      const delayStr = d.delay > 0 ? chalk.red(` +${d.delay}min`) : '';
      const realtimeStr = d.realtime ? chalk.green(' ●') : '';
      
      console.log(
        chalk.cyan(chalk.bold(`${d.line}`.padEnd(4))) +
        chalk.gray(d.lineName.padEnd(12)) +
        ' → ' +
        d.direction.substring(0, 30).padEnd(30) +
        chalk.white(time) +
        delayStr +
        realtimeStr
      );
    }
    
    console.log(chalk.gray('─'.repeat(60)));
    
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

/**
 * Command: Search for stops
 */
async function searchCmd(name, options) {
  try {
    const stops = await searchStops(name);
    
    if (stops.length === 0) {
      console.log(chalk.yellow('No stops found.'));
      return;
    }
    
    console.log(chalk.bold(`\n🔍 Search results for "${name}":\n`));
    
    for (const s of stops) {
      const dist = s.distance ? chalk.gray(`(${s.distance}m)`) : '';
      console.log(`  ${chalk.cyan(s.id)}  ${s.name} ${dist}`);
    }
    
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

/**
 * Command: Find route
 */
async function routeCmd(from, to, options) {
  try {
    const routes = await getRoutes(from, to, {
      arrivalTime: options.arrival,
      departureTime: options.departure === true ? undefined : options.departure,
      maxChanges: options.changes || 5
    });
    
    if (routes.length === 0) {
      console.log(chalk.yellow('No routes found.'));
      return;
    }
    
    console.log(chalk.bold(`\n🚇 Route: ${from} → ${to}\n`));
    
    for (let i = 0; i < routes.length; i++) {
      const r = routes[i];
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.bold(`Option ${i + 1}: ${r.departure} → ${r.arrival} (${r.duration}) ${chalk.gray(`(${r.changes} change${r.changes !== 1 ? 's' : ''})`)}`));
      
      for (const leg of r.legs) {
        if (!leg.line) continue;
        console.log(
          `  ${chalk.cyan(leg.line.padEnd(4))}` +
          chalk.gray(leg.lineName.substring(0, 12).padEnd(12)) +
          '  ' +
          `${leg.departure} → ${leg.arrival}` +
          chalk.gray(` (${leg.destination})`)
        );
      }
      console.log();
    }
    
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

/**
 * Command: Status
 */
async function statusCmd() {
  try {
    const status = await getStatus();
    console.log(chalk.bold('\n📡 grazy API Status\n'));
    console.log(`  Server Time: ${chalk.white(status.serverTime)}`);
    console.log(`  API:         ${chalk.green(status.api)}`);
    console.log();
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
  }
}

module.exports = {
  departuresCmd,
  searchCmd,
  routeCmd,
  statusCmd
};
