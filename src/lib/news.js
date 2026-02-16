/**
 * RSS News Fetcher for Graz
 * Sources: ORF Steiermark, Kleine Zeitung
 */

const RSS_SOURCES = {
  orf: {
    name: 'ORF Steiermark',
    url: 'https://rss.orf.at/steiermark.xml'
  },
  kleine: {
    name: 'Kleine Zeitung Steiermark',
    url: 'https://kleinezeitung.at/rss/steiermark'
  },
  sport: {
    name: 'Kleine Zeitung Sport',
    url: 'https://kleinezeitung.at/rss/sport'
  }
};

/**
 * Fetch and parse RSS feed
 */
async function fetchRSS(source) {
  const config = RSS_SOURCES[source];
  if (!config) {
    throw new Error(`Unknown source: ${source}. Available: orf, kleine, sport`);
  }
  
  try {
    const res = await fetch(config.url);
    const xml = await res.text();
    return parseRSS(xml, config.name);
  } catch (err) {
    throw new Error(`Failed to fetch ${config.name}: ${err.message}`);
  }
}

/**
 * Simple XML parser for RSS
 */
function parseRSS(xml, sourceName) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null && items.length < 15) {
    const itemXml = match[1];
    
    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const description = extractTag(itemXml, 'description');
    const pubDate = extractTag(itemXml, 'pubDate');
    
    if (title) {
      items.push({
        title: cleanHTML(title),
        link,
        description: cleanHTML(description)?.substring(0, 200) + '...',
        date: formatDate(pubDate),
        source: sourceName
      });
    }
  }
  
  return items;
}

function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}>([\\s\\S]*?)</${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? (match[1] || match[2] || '').trim() : '';
}

function cleanHTML(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-AT', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch {
    return dateStr;
  }
}

/**
 * Get all news from all sources
 */
async function getAllNews(options = {}) {
  const { limit = 10 } = options;
  const results = [];
  
  for (const source of Object.keys(RSS_SOURCES)) {
    try {
      const items = await fetchRSS(source);
      results.push(...items);
    } catch (err) {
      console.error(`Error fetching ${source}:`, err.message);
    }
  }
  
  // Sort by date (newest first)
  results.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return results.slice(0, limit);
}

module.exports = {
  fetchRSS,
  getAllNews,
  RSS_SOURCES
};
