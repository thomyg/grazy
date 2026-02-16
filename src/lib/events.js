/**
 * Events API Client - KulturServer Graz RSS
 * Fetches and parses events from kultur.graz.at RSS feeds
 */

const BASE_URL = 'https://www.kultur.graz.at/kalender_rss';

// Category to feed mapping
const CATEGORIES = {
  all: 'ksv3_30tage.xml',
  musik: 'ksv3_30tage_musik.xml',
  theater: 'ksv3_30tage_theatertanz.xml',
  ausstellungen: 'ksv3_30tage_ausstellungen.xml',
  kabarett: 'ksv3_30tage_kabarettkleinkunst.xml',
  kinder: 'ksv3_30tage_kinderjugend.xml',
  lesungen: 'ksv3_30tage_lesungvortrag.xml',
  fuehrungen: 'ksv3_30tage_fuehrungen.xml',
  film: 'ksv3_30tage_filmneuemedien.xml',
  hinweise: 'ksv3_30tage_hinweise.xml'
};

const CATEGORY_LABELS = {
  all: 'Alle',
  musik: 'Musik',
  theater: 'Theater & Tanz',
  ausstellungen: 'Ausstellungen',
  kabarett: 'Kabarett & Kleinkunst',
  kinder: 'Kinder & Jugend',
  lesungen: 'Lesungen & Vorträge',
  fuehrungen: 'Führungen',
  film: 'Film & Neue Medien',
  hinweise: 'Hinweise'
};

const DATE_FILTERS = {
  heute: 'heute',
  today: 'heute',
  morgen: 'morgen',
  tomorrow: 'morgen',
  woche: 'woche',
  week: 'woche',
  wochenende: 'wochenende',
  weekend: 'wochenende',
  monat: 'monat',
  month: 'monat'
};

const DATE_FILTER_LABELS = {
  heute: 'Heute',
  morgen: 'Morgen',
  woche: 'Diese Woche',
  wochenende: 'Wochenende',
  monat: 'Diesen Monat'
};

/**
 * Parse date info string to date object
 */
function parseDateInfo(dateStr) {
  if (!dateStr || !dateStr.trim()) return { start: null, end: null };
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  const trimmed = dateStr.trim();
  
  // Single day: "22.02."
  const singleMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.$/);
  if (singleMatch) {
    const day = parseInt(singleMatch[1], 10);
    const month = parseInt(singleMatch[2], 10);
    let year = currentYear;
    if (month < currentMonth - 2) year = currentYear + 1;
    const date = new Date(year, month - 1, day);
    return { start: date, end: date };
  }
  
  // "bis 14.04." - runs until
  const bisMatch = trimmed.match(/^bis\s+(\d{1,2})\.(\d{1,2})\.$/);
  if (bisMatch) {
    const day = parseInt(bisMatch[1], 10);
    const month = parseInt(bisMatch[2], 10);
    let year = currentYear;
    if (month < currentMonth - 2) year = currentYear + 1;
    return { start: null, end: new Date(year, month - 1, day) };
  }
  
  // "22.02. bis 28.02." - date range
  const rangeMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.\s*bis\s*(\d{1,2})\.(\d{1,2})\.$/);
  if (rangeMatch) {
    const startDay = parseInt(rangeMatch[1], 10);
    const startMonth = parseInt(rangeMatch[2], 10);
    const endDay = parseInt(rangeMatch[3], 10);
    const endMonth = parseInt(rangeMatch[4], 10);
    let year = currentYear;
    if (startMonth < currentMonth - 2) year = currentYear + 1;
    return { 
      start: new Date(year, startMonth - 1, startDay), 
      end: new Date(year, endMonth - 1, endDay) 
    };
  }
  
  // "ab 01.03." - from date
  const abMatch = trimmed.match(/^ab\s+(\d{1,2})\.(\d{1,2})\.$/);
  if (abMatch) {
    const day = parseInt(abMatch[1], 10);
    const month = parseInt(abMatch[2], 10);
    let year = currentYear;
    if (month < currentMonth - 2) year = currentYear + 1;
    return { start: new Date(year, month - 1, day), end: null };
  }
  
  return { start: null, end: null };
}

/**
 * Check if a date falls within a specific range
 */
function isDateInRange(date, start, end) {
  if (!date) return false;
  
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (start && end) {
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    return d >= s && d <= e;
  }
  
  if (start) {
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    return d.getTime() === s.getTime();
  }
  
  if (end) {
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    return d.getTime() === e.getTime();
  }
  
  return false;
}

/**
 * Check if a date is today
 */
function isToday(date) {
  if (!date) return false;
  const now = new Date();
  return date.getFullYear() === now.getFullYear() &&
         date.getMonth() === now.getMonth() &&
         date.getDate() === now.getDate();
}

/**
 * Check if a date is tomorrow
 */
function isTomorrow(date) {
  if (!date) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.getFullYear() === tomorrow.getFullYear() &&
         date.getMonth() === tomorrow.getMonth() &&
         date.getDate() === tomorrow.getDate();
}

/**
 * Check if a date is in current week (Monday-Sunday)
 */
function isThisWeek(date) {
  if (!date) return false;
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return date >= monday && date <= sunday;
}

/**
 * Check if a date is on weekend (Saturday or Sunday)
 */
function isWeekend(date) {
  if (!date) return false;
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Check if a date is in current month
 */
function isThisMonth(date) {
  if (!date) return false;
  const now = new Date();
  return date.getFullYear() === now.getFullYear() &&
         date.getMonth() === now.getMonth();
}

/**
 * Check if event matches the date filter
 * @param {Object} parsedDate - { start: Date|null, end: Date|null }
 * @param {string} when - Filter: "heute", "morgen", "woche", "wochenende", "monat"
 * @returns {boolean}
 */
function matchesDateFilter(parsedDate, when) {
  // No filter = show all
  if (!when) return true;
  
  const filter = DATE_FILTERS[when.toLowerCase()];
  if (!filter) return true;
  
  const { start, end } = parsedDate || {};
  
  // Events without date always show
  if (!start && !end) return true;
  
  switch (filter) {
    case 'heute':
      // start <= today <= end, or start === today, or end === today, or if only end: today <= end
      if (start && end) return isDateInRange(new Date(), start, end);
      if (start) return isToday(start);
      if (end) {
        const today = new Date();
        return today <= end;
      }
      return true;
      
    case 'morgen':
      if (start && end) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return isDateInRange(tomorrow, start, end);
      }
      if (start) return isTomorrow(start);
      if (end) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow <= end;
      }
      return true;
      
    case 'woche':
      if (start && end) {
        // Event spans this week
        const thisWeekStart = getMonday(new Date());
        const thisWeekEnd = new Date(thisWeekStart);
        thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
        
        return !(end < thisWeekStart || start > thisWeekEnd);
      }
      if (start) return isThisWeek(start);
      if (end) return isThisWeek(end);
      return true;
      
    case 'wochenende':
      // Check if any day in the event range falls on weekend
      if (start && end) {
        const current = new Date(start);
        while (current <= end) {
          if (isWeekend(current)) return true;
          current.setDate(current.getDate() + 1);
        }
        return false;
      }
      if (start) return isWeekend(start);
      if (end) return isWeekend(end);
      return true;
      
    case 'monat':
      if (start && end) {
        const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const thisMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        
        return !(end < thisMonthStart || start > thisMonthEnd);
      }
      if (start) return isThisMonth(start);
      if (end) return isThisMonth(end);
      return true;
      
    default:
      return true;
  }
}

/**
 * Get Monday of current week
 */
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * Parse a single HTML line into an event object
 */
function parseEventLine(line) {
  if (!line || !line.trim()) return null;
  
  // Look for: <a href="URL">TITLE</a>, VENUE, DATE
  const match = line.match(/<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>\s*,?\s*([^<]*)/i);
  
  if (!match) return null;
  
  const url = match[1];
  const title = match[2].trim();
  const venueAndDate = match[3] || '';
  
  const parts = venueAndDate.split(',').map(p => p.trim()).filter(p => p);
  
  return {
    title,
    url,
    location: parts[0] || '',
    date: parts.slice(1).join(', ')
  };
}

/**
 * Fetch and parse RSS feed
 */
async function fetchRSS(feedFile) {
  const url = `${BASE_URL}/${feedFile}`;
  
  let res;
  try {
    res = await fetch(url, {
      headers: {
        'User-Agent': 'grazy CLI',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    throw new Error(`Konnte Events nicht laden: ${err.message}`);
  }
  
  const text = await res.text();
  const events = [];
  
  // Find all items
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  
  while ((match = itemRegex.exec(text)) !== null) {
    const itemContent = match[1];
    
    // Extract title (category name)
    const titleMatch = itemContent.match(/<title>([^<]+)<\/title>/i);
    const categoryName = titleMatch ? titleMatch[1].trim() : 'Unbekannt';
    
    // Extract description
    let descMatch = itemContent.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    if (!descMatch) {
      descMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/i);
    }
    if (!descMatch) continue;
    
    // Unescape HTML
    let content = descMatch[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"');
    
    // Split by <br> tags
    const lines = content.split(/<br\s*\/?>/i);
    
    for (const line of lines) {
      const event = parseEventLine(line);
      if (event) {
        events.push({
          ...event,
          category: categoryName
        });
      }
    }
  }
  
  return events;
}

/**
 * Get events from KulturServer Graz
 */
async function getEvents(options = {}) {
  const { category = 'all', limit = 20, when = null } = options;
  
  const feedFile = CATEGORIES[category.toLowerCase()] || CATEGORIES.all;
  
  const allEvents = await fetchRSS(feedFile);
  
  // Parse dates and filter
  const eventsWithDates = allEvents.map(e => ({
    ...e,
    dateParsed: parseDateInfo(e.date)
  }));
  
  // Apply date filter if provided
  let filtered = eventsWithDates;
  if (when) {
    filtered = eventsWithDates.filter(e => matchesDateFilter(e.dateParsed, when));
  }
  
  const events = filtered.slice(0, limit).map(e => ({
    title: e.title,
    url: e.url,
    location: e.location,
    date: e.date,
    category: e.category,
    dateParsed: e.dateParsed
  }));
  
  return {
    location: 'Graz',
    category: CATEGORY_LABELS[category.toLowerCase()] || 'Alle',
    whenLabel: when ? (DATE_FILTER_LABELS[when.toLowerCase()] || when) : null,
    count: events.length,
    events
  };
}

function getCategories() {
  return Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label }));
}

function getDateFilters() {
  return Object.entries(DATE_FILTER_LABELS).map(([key, label]) => ({ key, label }));
}

module.exports = {
  getEvents,
  getCategories,
  getDateFilters,
  CATEGORIES,
  CATEGORY_LABELS,
  DATE_FILTERS,
  DATE_FILTER_LABELS,
  parseDateInfo,
  matchesDateFilter,
  parseEventLine
};
