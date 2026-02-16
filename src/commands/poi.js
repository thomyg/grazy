const chalk = require('chalk');
const { searchPOIs, searchNearPOIs, POI_TYPES } = require('../lib/poi');

/**
 * Command: POI Search
 */
async function poiCmd(type, options) {
  try {
    const limit = parseInt(options.limit) || 10;
    
    // Show available types if no type given
    if (!type || type === 'help') {
      console.log(chalk.bold('\n🔍 Available POI Types:\n'));
      const types = Object.entries(POI_TYPES);
      for (let i = 0; i < types.length; i += 3) {
        const row = types.slice(i, i + 3).map(([key, val]) => 
          `${val.icon} ${chalk.cyan(key.padEnd(12))}`
        ).join('  ');
        console.log(row);
      }
      console.log(chalk.gray('\nExample: grazy poi restaurant'));
      console.log();
      return;
    }
    
    // Search
    const pois = await searchPOIs(type, { limit });
    
    if (pois.length === 0) {
      console.log(chalk.yellow(`\n🔍 No ${type} found in Graz.\n`));
      return;
    }
    
    const poiType = POI_TYPES[type.toLowerCase()];
    console.log(chalk.bold(`\n🔍 ${poiType?.label || type} in Graz\n`));
    console.log(chalk.gray('─'.repeat(60)));
    
    for (const poi of pois) {
      console.log(chalk.cyan('📍') + ' ' + chalk.bold(poi.name));
      if (poi.address) {
        console.log('   ' + chalk.gray(poi.address));
      }
      if (poi.additional) {
        for (const info of poi.additional.slice(0, 2)) {
          console.log('   ' + chalk.gray(info));
        }
      }
      console.log();
    }
    
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.gray(`Found ${pois.length} results`));
    console.log();
    
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

module.exports = {
  poiCmd
};
