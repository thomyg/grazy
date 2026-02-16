/**
 * Air Quality API Client - Open-Meteo
 * Free API, no key required
 */

const GRAZ_COORDS = {
  latitude: 47.0767,
  longitude: 15.4214,
  name: 'Graz'
};

/**
 * Get air quality for Graz
 */
async function getAirQuality() {
  const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  url.searchParams.set('latitude', GRAZ_COORDS.latitude);
  url.searchParams.set('longitude', GRAZ_COORDS.longitude);
  url.searchParams.set('current', 'us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide,carbon_monoxide');
  url.searchParams.set('timezone', 'Europe/Vienna');
  
  const res = await fetch(url.toString());
  const data = await res.json();
  
  const current = data.current;
  
  return {
    location: GRAZ_COORDS.name,
    timestamp: current?.time,
    aqi: current?.us_aqi,
    pm10: current?.pm10,
    pm25: current?.pm2_5,
    no2: current?.nitrogen_dioxide,
    o3: current?.ozone,
    so2: current?.sulphur_dioxide,
    co: current?.carbon_monoxide,
    level: getAQLevel(current?.us_aqi),
    description: getAQDescription(current?.us_aqi)
  };
}

/**
 * Get AQI level color/text
 */
function getAQLevel(aqi) {
  if (aqi === undefined || aqi === null) return 'unknown';
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy_sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very_unhealthy';
  return 'hazardous';
}

/**
 * Get AQI description
 */
function getAQDescription(aqi) {
  if (aqi === undefined || aqi === null) return 'No data';
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for sensitive groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

module.exports = {
  getAirQuality,
  getAQLevel,
  getAQDescription,
  GRAZ_COORDS
};
