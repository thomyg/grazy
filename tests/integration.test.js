/**
 * Integration tests for CLI commands
 */

const { execSync } = require('child_process');
const grazy = './src/index.js';

function grazyCmd(args) {
  return execSync(`node ${grazy} ${args}`, { 
    encoding: 'utf-8',
    timeout: 10000
  });
}

describe('CLI Commands', () => {
  test('grazy --help shows help', () => {
    const output = grazyCmd('--help');
    expect(output).toContain('grazy');
    expect(output).toContain('Commands');
  });
  
  test('grazy --version shows version', () => {
    const output = grazyCmd('--version');
    expect(output).toMatch(/^\d+\.\d+\.\d+/);
  });
  
  test('grazy status returns API status', () => {
    const output = grazyCmd('status');
    expect(output).toContain('API');
    expect(output).toContain('Server Time');
  });
  
  test('grazy weather returns weather data', () => {
    const output = grazyCmd('weather');
    expect(output).toContain('Weather');
    expect(output).toContain('Graz');
    expect(output).toContain('°C');
  });
  
  test('grazy departures returns departures', () => {
    const output = grazyCmd('departures "Jakomini"');
    expect(output).toContain('Departures');
    expect(output).toContain('Jakomini');
  });
  
  test('grazy poi help shows POI types', () => {
    const output = grazyCmd('poi help');
    expect(output).toContain('POI Types');
    expect(output).toContain('restaurant');
    expect(output).toContain('cafe');
  });
  
  test('grazy news returns news', () => {
    const output = grazyCmd('news --limit 3');
    expect(output).toContain('News');
    expect(output).toContain('ORF');
  });
  
  test('grazy air returns air quality', () => {
    const output = grazyCmd('air');
    expect(output).toContain('Air Quality');
    expect(output).toContain('AQI');
  });
});

describe('Error Handling', () => {
  test('unknown command shows error', () => {
    try {
      grazyCmd('unknowncommand');
    } catch (err) {
      expect(err.status).toBe(1);
    }
  });
});
