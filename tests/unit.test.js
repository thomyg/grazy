/**
 * Unit tests for grazy CLI
 */

const { getWeatherCondition } = require('../src/lib/weather');
const { getAQLevel, getAQDescription } = require('../src/lib/airquality');
const { POI_TYPES } = require('../src/lib/poi');
const { RSS_SOURCES } = require('../src/lib/news');

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
