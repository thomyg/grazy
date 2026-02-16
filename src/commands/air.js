const chalk = require('chalk');
const { getAirQuality } = require('../lib/airquality');

/**
 * Command: Air Quality
 */
async function airCmd(options) {
  try {
    const data = await getAirQuality();
    
    // Color based on AQI
    const aqiColors = {
      good: chalk.green,
      moderate: chalk.yellow,
      unhealthy_sensitive: chalk.hex('#FFA500'),
      unhealthy: chalk.red,
      very_unhealthy: chalk.red.bold,
      hazardous: chalk.bgRed.white,
      unknown: chalk.gray
    };
    
    const color = aqiColors[data.level] || chalk.white;
    const levelEmoji = {
      good: '✅',
      moderate: '⚠️',
      unhealthy_sensitive: '🤧',
      unhealthy: '😷',
      very_unhealthy: '🚨',
      hazardous: '☠️',
      unknown: '❓'
    };
    
    console.log(chalk.bold(`\n🌬️  Air Quality in ${data.location}\n`));
    console.log(chalk.cyan('┌─────────────────────────────────────┐'));
    console.log(chalk.cyan('│') + '  AQI: ' + color(` ${data.aqi} `).padEnd(33) + chalk.cyan('│'));
    console.log(chalk.cyan('│') + `  ${levelEmoji[data.level] || ''} ${data.description}`.padEnd(37) + chalk.cyan('│'));
    console.log(chalk.cyan('└─────────────────────────────────────┘\n'));
    
    // Detailed metrics
    console.log(chalk.bold('📊 Details:\n'));
    console.log(`  ${chalk.gray('PM2.5:')}  ${chalk.white(data.pm25 + ' μg/m³')}`);
    console.log(`  ${chalk.gray('PM10:')}  ${chalk.white(data.pm10 + ' μg/m³')}`);
    console.log(`  ${chalk.gray('NO₂:')}   ${chalk.white(data.no2 + ' μg/m³')}`);
    console.log(`  ${chalk.gray('O₃:')}    ${chalk.white(data.o3 + ' μg/m³')}`);
    console.log(`  ${chalk.gray('SO₂:')}   ${chalk.white(data.so2 + ' μg/m³')}`);
    console.log(`  ${chalk.gray('CO:')}    ${chalk.white(data.co + ' μg/m³')}`);
    console.log();
    
    // AQI Scale
    console.log(chalk.bold('📈 AQI Scale:\n'));
    console.log(`  ${chalk.green('0-50')}    Good`);
    console.log(`  ${chalk.yellow('51-100')}   Moderate`);
    console.log(`  ${chalk.hex('#FFA500')('101-150')}  Unhealthy for sensitive`);
    console.log(`  ${chalk.red('151-200')}  Unhealthy`);
    console.log(`  ${chalk.red.bold('201-300')}  Very Unhealthy`);
    console.log(`  ${chalk.bgRed.white('300+')}   Hazardous`);
    console.log();
    
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

module.exports = {
  airCmd
};
