const chalk = require('chalk');
const { getWeather, getWeatherCondition } = require('../lib/weather');

/**
 * Command: Weather
 */
async function weatherCmd(options) {
  try {
    const days = parseInt(options.days) || 3;
    const data = await getWeather({ days });
    
    const c = data.current;
    console.log(chalk.bold(`\n🌤️  Weather in ${data.location}\n`));
    
    // Current weather
    console.log(chalk.cyan('┌─────────────────────────────────────┐'));
    console.log(chalk.cyan('│') + chalk.bold(`  ${c.condition}`).padEnd(37) + chalk.cyan('│'));
    console.log(chalk.cyan('│') + `  ${chalk.white.bold(c.temp + '°C')}  (feels like ${c.feelsLike}°C)`.padEnd(37) + chalk.cyan('│'));
    console.log(chalk.cyan('│') + `  💧 ${c.humidity}% humidity`.padEnd(37) + chalk.cyan('│'));
    console.log(chalk.cyan('│') + `  💨 ${c.wind} km/h wind`.padEnd(37) + chalk.cyan('│'));
    if (c.uvIndex) {
      console.log(chalk.cyan('│') + `  ☀️  UV Index: ${c.uvIndex}`.padEnd(37) + chalk.cyan('│'));
    }
    console.log(chalk.cyan('└─────────────────────────────────────┘\n'));
    
    // Forecast
    if (data.daily && data.daily.length > 0) {
      console.log(chalk.bold('📅 Forecast:\n'));
      
      for (const day of data.daily) {
        const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const tempStr = `${Math.round(day.tempMin)}° → ${Math.round(day.tempMax)}°`;
        const precip = day.precipitation > 0 ? ` 💧${day.precipitation}mm` : '';
        
        console.log(
          chalk.gray(date.padEnd(12)) +
          chalk.yellow(day.condition.padEnd(20)) +
          chalk.white(tempStr.padEnd(12)) +
          chalk.cyan(precip)
        );
      }
      console.log();
    }
    
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

module.exports = {
  weatherCmd
};
