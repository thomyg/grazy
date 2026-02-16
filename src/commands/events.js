const chalk = require('chalk');
const { getEvents, getCategories, getDateFilters, CATEGORIES, DATE_FILTERS } = require('../lib/events');

/**
 * Format date for display
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  return dateStr;
}

/**
 * Command: Events
 */
async function eventsCmd(options) {
  try {
    const category = options.category || 'all';
    const when = options.when || null;
    const limit = parseInt(options.limit) || 15;
    
    // Show category help
    if (category === 'help' || category === 'hilfe') {
      console.log(chalk.bold('\n📅 Verfügbare Kategorien:\n'));
      const cats = getCategories();
      for (const c of cats) {
        console.log(`  ${chalk.cyan(c.key.padEnd(15))} ${c.label}`);
      }
      console.log();
      return;
    }
    
    // Show date filter help
    if (when === 'help' || when === 'hilfe') {
      console.log(chalk.bold('\n📅 Verfügbare Zeitfilter:\n'));
      const filters = getDateFilters();
      for (const f of filters) {
        console.log(`  ${chalk.cyan(f.key.padEnd(15))} ${f.label}`);
      }
      console.log();
      return;
    }
    
    console.log(chalk.bold(`\n📅 Events in Graz`));
    
    // Show category and time filter in header
    const parts = [];
    if (category && category !== 'all') {
      parts.push(category);
    }
    if (when) {
      parts.push(when);
    }
    if (parts.length > 0) {
      console.log(chalk.gray(`  — ${parts.join(' — ')}`));
    }
    console.log();
    
    console.log(chalk.gray('Lade von kultur.graz.at...\n'));
    
    const data = await getEvents({ category, when, limit });
    
    if (data.events.length === 0) {
      console.log(chalk.yellow('Keine Events gefunden.'));
      return;
    }
    
    console.log(chalk.gray(`Gefunden: ${data.count} Events\n`));
    console.log(chalk.gray('─'.repeat(60)));
    
    for (const event of data.events) {
      // Date in cyan
      if (event.date) {
        console.log(chalk.cyan(event.date));
      }
      
      // Title in bold
      console.log(chalk.bold(event.title));
      
      // Location in gray
      if (event.location) {
        console.log(chalk.gray(`  📍 ${event.location}`));
      }
      
      // URL in dim
      console.log(chalk.dim(`  🔗 ${event.url}`));
      console.log();
    }
    
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.gray('Source: kultur.graz.at'));
    console.log();
    
  } catch (err) {
    console.error(chalk.red(`Fehler: ${err.message}`));
    process.exit(1);
  }
}

module.exports = {
  eventsCmd
};
