/**
 * Unit tests for grazy CLI
 */

const { getWeatherCondition } = require('../src/lib/weather');
const { getAQLevel, getAQDescription } = require('../src/lib/airquality');
const { POI_TYPES } = require('../src/lib/poi');
const { RSS_SOURCES } = require('../src/lib/news');
const { CATEGORIES, parseDateInfo, matchesDateFilter, parseEventLine, DATE_FILTERS } = require('../src/lib/events');

describe('Weather', () => {
  test('getWeatherCondition returns correct text for weather codes', () => {
    expect(getWeatherCondition(0)).toBe('Clear sky');
    expect(getWeatherCondition(1)).toBe('Mainly clear');
    expect(getWeatherCondition(63)).toBe('Moderate rain');
    expect(getWeatherCondition(95)).toBe('Thunderstorm');
  });
  
  test('getWeatherCondition handles unknown codes', () => {
    expect(getWeatherCondition(999)).toBe('Unknown');
    expect(getWeatherCondition(null)).toBe('Unknown');
  });
});

describe('Air Quality', () => {
  test('getAQLevel returns correct level for AQI values', () => {
    expect(getAQLevel(25)).toBe('good');
    expect(getAQLevel(50)).toBe('good');
    expect(getAQLevel(75)).toBe('moderate');
    expect(getAQLevel(100)).toBe('moderate');
    expect(getAQLevel(125)).toBe('unhealthy_sensitive');
    expect(getAQLevel(175)).toBe('unhealthy');
    expect(getAQLevel(250)).toBe('very_unhealthy');
    expect(getAQLevel(350)).toBe('hazardous');
  });
  
  test('getAQLevel handles null/undefined', () => {
    expect(getAQLevel(null)).toBe('unknown');
    expect(getAQLevel(undefined)).toBe('unknown');
  });
  
  test('getAQDescription returns correct description', () => {
    expect(getAQDescription(25)).toBe('Good');
    expect(getAQDescription(75)).toBe('Moderate');
    expect(getAQDescription(350)).toBe('Hazardous');
  });
});

describe('POI Types', () => {
  test('POI_TYPES contains expected categories', () => {
    expect(POI_TYPES).toHaveProperty('restaurant');
    expect(POI_TYPES).toHaveProperty('cafe');
    expect(POI_TYPES).toHaveProperty('bar');
    expect(POI_TYPES).toHaveProperty('pharmacy');
    expect(POI_TYPES).toHaveProperty('hospital');
    expect(POI_TYPES).toHaveProperty('parking');
  });
  
  test('POI_TYPES entries have required properties', () => {
    for (const [key, value] of Object.entries(POI_TYPES)) {
      expect(value).toHaveProperty('amenity');
      expect(value).toHaveProperty('label');
      expect(value).toHaveProperty('icon');
    }
  });
});

describe('News Sources', () => {
  test('RSS_SOURCES contains ORF and Kleine Zeitung', () => {
    expect(RSS_SOURCES).toHaveProperty('orf');
    expect(RSS_SOURCES).toHaveProperty('kleine');
    expect(RSS_SOURCES).toHaveProperty('sport');
  });
  
  test('RSS_SOURCES entries have name and url', () => {
    expect(RSS_SOURCES.orf).toHaveProperty('name');
    expect(RSS_SOURCES.orf).toHaveProperty('url');
    expect(RSS_SOURCES.orf.url).toContain('orf.at');
  });
});

describe('Events - Categories', () => {
  test('CATEGORIES contains all expected keys', () => {
    expect(CATEGORIES).toHaveProperty('all');
    expect(CATEGORIES).toHaveProperty('musik');
    expect(CATEGORIES).toHaveProperty('theater');
    expect(CATEGORIES).toHaveProperty('ausstellungen');
    expect(CATEGORIES).toHaveProperty('kabarett');
    expect(CATEGORIES).toHaveProperty('kinder');
    expect(CATEGORIES).toHaveProperty('lesungen');
    expect(CATEGORIES).toHaveProperty('fuehrungen');
    expect(CATEGORIES).toHaveProperty('film');
    expect(CATEGORIES).toHaveProperty('hinweise');
  });
  
  test('DATE_FILTERS contains all expected keys', () => {
    expect(DATE_FILTERS).toHaveProperty('heute');
    expect(DATE_FILTERS).toHaveProperty('morgen');
    expect(DATE_FILTERS).toHaveProperty('woche');
    expect(DATE_FILTERS).toHaveProperty('wochenende');
    expect(DATE_FILTERS).toHaveProperty('monat');
    expect(DATE_FILTERS).toHaveProperty('today');
    expect(DATE_FILTERS).toHaveProperty('tomorrow');
    expect(DATE_FILTERS).toHaveProperty('week');
    expect(DATE_FILTERS).toHaveProperty('weekend');
    expect(DATE_FILTERS).toHaveProperty('month');
  });
});

describe('Events - parseDateInfo', () => {
  test('parses single date "22.02." correctly', () => {
    const result = parseDateInfo('22.02.');
    expect(result.start).toBeInstanceOf(Date);
    expect(result.end).toBeInstanceOf(Date);
    expect(result.start.getDate()).toBe(22);
    expect(result.start.getMonth()).toBe(1); // February = 1
  });
  
  test('parses "bis 14.04." correctly', () => {
    const result = parseDateInfo('bis 14.04.');
    expect(result.start).toBeNull();
    expect(result.end).toBeInstanceOf(Date);
    expect(result.end.getDate()).toBe(14);
    expect(result.end.getMonth()).toBe(3); // April = 3
  });
  
  test('parses date range "22.02. bis 28.02." correctly', () => {
    const result = parseDateInfo('22.02. bis 28.02.');
    expect(result.start).toBeInstanceOf(Date);
    expect(result.end).toBeInstanceOf(Date);
    expect(result.start.getDate()).toBe(22);
    expect(result.end.getDate()).toBe(28);
  });
  
  test('returns nulls for empty string', () => {
    const result = parseDateInfo('');
    expect(result.start).toBeNull();
    expect(result.end).toBeNull();
  });
  
  test('returns nulls for null/undefined', () => {
    expect(parseDateInfo(null).start).toBeNull();
    expect(parseDateInfo(undefined).start).toBeNull();
  });
  
  test('parses "ab 01.03." correctly', () => {
    const result = parseDateInfo('ab 01.03.');
    expect(result.start).toBeInstanceOf(Date);
    expect(result.end).toBeNull();
    expect(result.start.getDate()).toBe(1);
    expect(result.start.getMonth()).toBe(2); // March = 2
  });
});

describe('Events - matchesDateFilter', () => {
  test('returns true for null/undefined filter (show all)', () => {
    expect(matchesDateFilter({ start: null, end: null }, null)).toBe(true);
    expect(matchesDateFilter({ start: null, end: null }, undefined)).toBe(true);
    expect(matchesDateFilter({ start: new Date(), end: new Date() }, null)).toBe(true);
  });
  
  test('returns true for unknown filter (show all)', () => {
    expect(matchesDateFilter({ start: new Date(), end: new Date() }, 'unbekannt')).toBe(true);
  });
  
  test('events without date show for all filters', () => {
    expect(matchesDateFilter({ start: null, end: null }, 'heute')).toBe(true);
    expect(matchesDateFilter({ start: null, end: null }, 'morgen')).toBe(true);
    expect(matchesDateFilter({ start: null, end: null }, 'woche')).toBe(true);
    expect(matchesDateFilter({ start: null, end: null }, 'wochenende')).toBe(true);
    expect(matchesDateFilter({ start: null, end: null }, 'monat')).toBe(true);
  });
  
  test('handles case-insensitive filters', () => {
    expect(matchesDateFilter({ start: null, end: null }, 'HEUTE')).toBe(true);
    expect(matchesDateFilter({ start: null, end: null }, 'Woche')).toBe(true);
    expect(matchesDateFilter({ start: null, end: null }, 'WEEKEND')).toBe(true);
  });
});

describe('Events - parseEventLine', () => {
  test('parses valid event line correctly', () => {
    const line = '<a href="https://kultur.graz.at/event/123">Jazz Night</a>, Orpheum, 22.02.';
    const result = parseEventLine(line);
    
    expect(result).not.toBeNull();
    expect(result.title).toBe('Jazz Night');
    expect(result.url).toBe('https://kultur.graz.at/event/123');
    expect(result.location).toBe('Orpheum');
    expect(result.date).toBe('22.02.');
  });
  
  test('returns null for empty line', () => {
    expect(parseEventLine('')).toBeNull();
    expect(parseEventLine('   ')).toBeNull();
  });
  
  test('returns null for line without link', () => {
    expect(parseEventLine('Some text without a link')).toBeNull();
  });
  
  test('handles line with only title and venue', () => {
    const line = '<a href="https://kultur.graz.at/event/456">Concert</a>, Kasematten';
    const result = parseEventLine(line);
    
    expect(result).not.toBeNull();
    expect(result.title).toBe('Concert');
    expect(result.location).toBe('Kasematten');
    expect(result.date).toBe('');
  });
  
  test('handles venue with comma', () => {
    const line = '<a href="https://kultur.graz.at/event/789">Show</a>, Theater, Neue Bühne, 15.03.';
    const result = parseEventLine(line);
    
    expect(result).not.toBeNull();
    expect(result.location).toBe('Theater');
    expect(result.date).toBe('Neue Bühne, 15.03.');
  });
});
