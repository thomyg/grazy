const chalk = require('chalk');
const { fetchRSS, getAllNews, RSS_SOURCES } = require('../lib/news');

/**
 * Command: News
 */
async function newsCmd(options) {
  try {
    const source = options.source;
    const limit = parseInt(options.limit) || 10;
    
    let news;
    if (source) {
      const items = await fetchRSS(source);
      news = items.slice(0, limit);
    } else {
      news = await getAllNews({ limit });
    }
    
    if (news.length === 0) {
      console.log(chalk.yellow('\n📰 No news found.\n'));
      return;
    }
    
    console.log(chalk.bold('\n📰 Graz News\n'));
    console.log(chalk.gray('─'.repeat(60)));
    
    for (const item of news) {
      const sourceLabel = `[${item.source}]`;
      console.log(chalk.cyan(sourceLabel) + ' ' + chalk.white(item.date));
      console.log(chalk.bold(item.title));
      if (item.description && item.description !== '...') {
        console.log(chalk.gray(item.description.substring(0, 100) + '...'));
      }
      console.log();
    }
    
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.gray(`Sources: ${Object.keys(RSS_SOURCES).join(', ')}`));
    console.log();
    
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

module.exports = {
  newsCmd
};
