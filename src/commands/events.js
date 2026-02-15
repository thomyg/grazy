const chalk = require('chalk');
const { getEvents, CATEGORIES } = require('../lib/events');

/**
 * Command: Events
 */
async function eventsCmd(options) {
  try {
    const category = options.category || 'all';
    const limit = parseInt(options.limit) || 10;
    
    const data = await getEvents({ category, limit });
    
    if (data.events.length === 0) {
      console.log(chalk.yellow('\n📅 No events found.\n'));
      console.log(chalk.gray(data.message || 'Check graz.at for current events.'));
      console.log();
      return;
    }
    
    console.log(chalk.bold(`\n📅 Upcoming Events in ${data.location}\n`));
    
    for (const event of data.events) {
      console.log(chalk.cyan(event.date || 'TBD') + '  ' + chalk.bold(event.title));
      if (event.location) {
        console.log(chalk.gray(`   📍 ${event.location}`));
      }
      if (event.category) {
        console.log(chalk.gray(`   🏷️  ${event.category}`));
      }
      console.log();
    }
    
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

module.exports = {
  eventsCmd
};
