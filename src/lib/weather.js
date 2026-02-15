/**
 * Weather API Client - Open-Meteo
 * Free API, no key required
 */

const GRAZ_COORDS = {
  latitude: 47.0767,
  longitude: 15.4214,
  name: 'Graz'
};

/**
 * Get current weather + forecast for Graz
 */
async function getWeather(options = {}) {
  const { days = 3 } = options;
  
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', GRAZ_COORDS.latitude);
  url.searchParams.set('longitude', GRAZ_COORDS.longitude);
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index');
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max');
  url.searchParams.set('timezone', 'Europe/Vienna');
  url.searchParams.set('forecast_days', days);
  
  const res = await fetch(url.toString());
  const data = await res.json();
  
  return {
    location: GRAZ_COORDS.name,
    current: {
      temp: data.current?.temperature_2m,
      feelsLike: data.current?.apparent_temperature,
      humidity: data.current?.relative_humidity_2m,
      wind: data.current?.wind_speed_10m,
      uvIndex: data.current?.uv_index,
      condition: getWeatherCondition(data.current?.weather_code),
      code: data.current?.weather_code
    },
    daily: (data.daily?.time || []).map((date, i) => ({
      date,
      tempMax: data.daily?.temperature_2m_max?.[i],
      tempMin: data.daily?.temperature_2m_min?.[i],
      precipitation: data.daily?.precipitation_sum?.[i],
      precipChance: data.daily?.precipitation_probability_max?.[i],
      uvIndex: data.daily?.uv_index_max?.[i],
      condition: getWeatherCondition(data.daily?.weather_code?.[i])
    }))
  };
}

/**
 * Map WMO weather codes to human-readable text
 */
function getWeatherCondition(code) {
  const conditions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  return conditions[code] || 'Unknown';
}

module.exports = {
  getWeather,
  getWeatherCondition,
  GRAZ_COORDS
};
