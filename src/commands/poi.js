const chalk = require('chalk');
const { searchPOIs, searchNearAddress, POI_TYPES } = require('../lib/poi');

/**
 * Command: POI Search
 */
async function poiCmd(type, options) {
  try {
    const limit = parseInt(options.limit) || 10;
    const near = options.near;
    const radius = parseInt(options.radius) || 1000;
    
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
      console.log(chalk.gray('Example: grazy poi cafe --near "Jakominiplatz" --radius 500'));
      console.log();
      return;
    }
    
    let pois, locationInfo;
    
    if (near) {
      // Search near address
      const result = await searchNearAddress(near, type, { limit, radius });
      pois = result.pois;
      locationInfo = result.location;
    } else {
      // Search all in Graz
      pois = await searchPOIs(type, { limit });
    }
    
    if (pois.length === 0) {
      console.log(chalk.yellow(`\n🔍 No ${type} found${near ? ` near ${near}` : ' in Graz'}.\n`));
      return;
    }
    
    const poiType = POI_TYPES[type.toLowerCase()];
    
    // Show location info if searching near address
    if (locationInfo) {
      console.log(chalk.bold(`\n📍 Near: ${locationInfo.address}\n`));
    }
    
    console.log(chalk.bold(`🔍 ${poiType?.label || type}${near ? ' near you' : ' in Graz'}\n`));
    console.log(chalk.gray('─'.repeat(60)));
    
    for (const poi of pois) {
      const distStr = poi.distance ? chalk.cyan(`${poi.distance}m`) : '';
      console.log(chalk.cyan('📍') + ' ' + chalk.bold(poi.name) + (distStr ? ' ' + chalk.gray(`(${distStr})`) : ''));
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
    console.log(chalk.gray(`Found ${pois.length} results${near ? ` within ${radius}m` : ''}`));
    console.log();
    
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

module.exports = {
  poiCmd
};
