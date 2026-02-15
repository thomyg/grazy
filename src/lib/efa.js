/**
 * EFA API Client für Verbund Linie Steiermark
 * https://efa.verbundlinie.at:8443/stv/
 */

const BASE_URL = 'https://efa.verbundlinie.at:8443/stv';
const { resolveStopId } = require('./knownStops');

/**
 * Sucht Haltestellen nach Name
 * @param {string} name - Haltestellen-Name
 * @returns {Promise<Array>} - Array von Haltestellen
 */
async function searchStops(name) {
  const url = `${BASE_URL}/XML_DM_REQUEST?outputFormat=JSON&type_dm=stop&name_dm=${encodeURIComponent(name)}&mode=direct&language=de`;
  const res = await fetch(url);
  const data = await res.json();
  
  let points = data?.dm?.itdOdvAssignedStops || [];
  
  // If no results, try with expanded search (mode: indirect)
  if (points.length === 0) {
    const altUrl = `${BASE_URL}/XML_DM_REQUEST?outputFormat=JSON&type_dm=stop&name_dm=${encodeURIComponent(name)}&mode=indirect&language=de`;
    const altRes = await fetch(altUrl);
    const altData = await altRes.json();
    points = altData?.dm?.itdOdvAssignedStops || [];
  }
  
  return points.map(p => ({
    id: p.stopID,
    name: p.nameWithPlace || p.name,
    place: p.place,
    distance: p.distance,
    distanceTime: p.distanceTime
  }));
}

/**
 * Gibt Echtzeit-Abfahrten an einer Haltestelle aus
 * @param {string} stopId - Stop-ID oder Name
 * @param {Object} options - Optionen
 * @returns {Promise<Array>} - Array von Abfahrten
 */
async function getDepartures(stopId, options = {}) {
  const { limit = 10, line, direction, type, timeRange = 120 } = options;
  
  // Versuche bekannte Stop-ID zu verwenden oder suchen
  let actualStopId = resolveStopId(stopId);
  if (!actualStopId) {
    const stops = await searchStops(stopId);
    if (stops.length === 0) throw new Error(`Keine Haltestelle gefunden: ${stopId}`);
    actualStopId = stops[0].id;
  }
  
  // itdTime weglassen für alle Abfahrten (Default ist "alle heute")
  const url = `${BASE_URL}/XML_DM_REQUEST?outputFormat=JSON&type_dm=stop&name_dm=${actualStopId}&mode=direct&language=de`;
  const res = await fetch(url);
  const data = await res.json();
  
  let departures = data?.departureList || [];
  if (!Array.isArray(departures)) departures = [];
  
  // Filter anwenden
  let filtered = departures;
  
  if (line) {
    filtered = filtered.filter(d => d.servingLine?.number === line);
  }
  
  if (direction) {
    filtered = filtered.filter(d => d.servingLine?.direction?.toLowerCase().includes(direction.toLowerCase()));
  }
  
  if (type) {
    filtered = filtered.filter(d => {
      const motType = d.servingLine?.motType;
      if (type === 'tram') return motType === '4'; // Straßenbahn
      if (type === 'bus') return motType === '6' || motType === '7'; // Bus
      return true;
    });
  }
  
  // Formatieren
  return filtered.slice(0, limit).map(d => ({
    line: d.servingLine?.number,
    lineName: d.servingLine?.name,
    direction: d.servingLine?.direction,
    platform: d.platform,
    scheduledTime: formatTime(d.dateTime),
    realTime: d.realDateTime ? formatTime(d.realDateTime) : null,
    delay: parseInt(d.servingLine?.delay || 0),
    realtime: d.servingLine?.realtime === '1',
    status: d.realtimeTripStatus
  }));
}

/**
 * Sucht Verbindung von A nach B
 * @param {string} from - Start-Haltestelle
 * @param {string} to - Ziel-Haltestelle
 * @param {Object} options - Optionen
 * @returns {Promise<Array>} - Array von Verbindungen
 */
async function getRoutes(from, to, options = {}) {
  const { arrivalTime, departureTime, date, maxChanges = 5 } = options;
  
  // Stop-IDs auflösen (erst knownStops versuchen, dann suchen)
  let fromId = resolveStopId(from);
  let toId = resolveStopId(to);
  
  if (!fromId) {
    const fromStops = await searchStops(from);
    if (fromStops.length === 0) throw new Error(`Start nicht gefunden: ${from}`);
    fromId = fromStops[0].id;
  }
  
  if (!toId) {
    const toStops = await searchStops(to);
    if (toStops.length === 0) throw new Error(`Ziel nicht gefunden: ${to}`);
    toId = toStops[0].id;
  }
  
  const params = new URLSearchParams({
    outputFormat: 'JSON',
    type_origin: 'stop',
    name_origin: fromId,
    type_dm: 'stop',
    name_dm: toId,
    mode: 'direct',
    language: 'de',
    itdTripDepAr: arrivalTime ? 'arrival' : 'departure',
    itdChanges: maxChanges
  });
  
  if (departureTime && typeof departureTime === 'string') {
    params.set('itdTime', departureTime.replace(':', ''));
  }
  if (date && typeof date === 'string') {
    params.set('itdDate', date.replace(/\./g, ''));
  }
  
  const url = `${BASE_URL}/XML_TRIP_REQUEST2?${params}`;
  const res = await fetch(url);
  const data = await res.json();
  
  const trips = data?.trip || [];
  if (!Array.isArray(trips)) return [];
  
  return trips.slice(0, 5).map(trip => {
    const legs = trip.legList?.leg || [];
    return {
      duration: trip.duration,
      departure: formatTime(trip.departure?.dateTime),
      arrival: formatTime(trip.arrival?.dateTime),
      changes: legs.filter(l => l.line?.number).length - 1,
      legs: legs.map(leg => ({
        line: leg.line?.number,
        lineName: leg.line?.name,
        type: leg.line?.motType,
        origin: leg.origin?.name,
        destination: leg.destination?.name,
        departure: formatTime(leg.origin?.dateTime),
        arrival: formatTime(leg.destination?.dateTime)
      }))
    };
  });
}

/**
 * Server-Status abfragen
 */
async function getStatus() {
  const url = `${BASE_URL}/XML_DM_REQUEST?outputFormat=JSON&type_dm=stop&name_dm=Graz%20Hauptbahnhof&mode=direct&language=de`;
  const res = await fetch(url);
  const data = await res.json();
  
  const serverTime = data?.parameters?.find(p => p.name === 'serverTime')?.value;
  return {
    serverTime,
    api: 'online'
  };
}

// Helper: Zeit formatieren
function formatTime(dt) {
  if (!dt) return null;
  const h = String(dt.hour || 0).padStart(2, '0');
  const m = String(dt.minute || 0).padStart(2, '0');
  return `${h}:${m}`;
}

module.exports = {
  searchStops,
  getDepartures,
  getRoutes,
  getStatus
};
