/**
 * POI Search via Overpass API (OpenStreetMap)
 * Keyless, free API
 */

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

const POI_TYPES = {
  restaurant: {
    amenity: 'restaurant',
    label: 'Restaurant',
    icon: '🍽️'
  },
  cafe: {
    amenity: 'cafe',
    label: 'Café',
    icon: '☕'
  },
  bar: {
    amenity: 'bar',
    label: 'Bar',
    icon: '🍸'
  },
  fast_food: {
    amenity: 'fast_food',
    label: 'Fast Food',
    icon: '🍔'
  },
  pub: {
    amenity: 'pub',
    label: 'Pub',
    icon: '🍺'
  },
  cinema: {
    amenity: 'cinema',
    label: 'Kino',
    icon: '🎬'
  },
  theatre: {
    amenity: 'theatre',
    label: 'Theater',
    icon: '🎭'
  },
  museum: {
    amenity: 'museum',
    label: 'Museum',
    icon: '🏛️'
  },
  library: {
    amenity: 'library',
    label: 'Bibliothek',
    icon: '📚'
  },
  pharmacy: {
    amenity: 'pharmacy',
    label: 'Apotheke',
    icon: '💊'
  },
  hospital: {
    amenity: 'hospital',
    label: 'Krankenhaus',
    icon: '🏥'
  },
  doctors: {
    amenity: 'doctors',
    label: 'Arzt',
    icon: '👨‍⚕️'
  },
  parking: {
    amenity: 'parking',
    label: 'Parkplatz',
    icon: '🅿️'
  },
  fuel: {
    amenity: 'fuel',
    label: 'Tankstelle',
    icon: '⛽'
  },
  atm: {
    amenity: 'atm',
    label: 'ATM',
    icon: '🏧'
  },
  bank: {
    amenity: 'bank',
    label: 'Bank',
    icon: '🏦'
  },
  playground: {
    amenity: 'playground',
    label: 'Spielplatz',
    icon: '🎢'
  },
  bench: {
    amenity: 'bench',
    label: 'Bank',
    icon: '🪑'
  },
  waste_basket: {
    amenity: 'waste_basket',
    label: 'Mülleimer',
    icon: '🗑️'
  }
};

/**
 * Geocode an address to coordinates
 */
async function geocodeAddress(address) {
  const url = new URL(NOMINATIM_URL);
  url.searchParams.set('q', `${address}, Graz, Austria`);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  
  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'grazy CLI' }
  });
  
  const data = await res.json();
  
  if (!data || data.length === 0) {
    throw new Error(`Address not found: ${address}`);
  }
  
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    display_name: data[0].display_name
  };
}

/**
 * Search POIs in Graz (all)
 */
async function searchPOIs(type, options = {}) {
  const { limit = 10, radius = 2000 } = options;
  
  const poiType = POI_TYPES[type.toLowerCase()];
  if (!poiType) {
    throw new Error(`Unknown POI type: ${type}. Available: ${Object.keys(POI_TYPES).join(', ')}`);
  }
  
  // Graz bounding box
  const bbox = '47.01,15.35,47.12,15.52';
  
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="${poiType.amenity}"](${bbox});
      way["amenity"="${poiType.amenity}"](${bbox});
    );
    out center ${limit};
  `;
  
  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  
  const data = await res.json();
  
  const pois = (data.elements || []).map(el => ({
    id: el.id,
    name: el.tags?.name || `${poiType.label} ${el.id.toString().slice(-4)}`,
    type: poiType.label,
    lat: el.lat || el.center?.lat,
    lon: el.lon || el.center?.lon,
    address: formatAddress(el.tags),
    additional: formatAdditional(el.tags)
  }));
  
  return pois;
}

/**
 * Search POIs near an address
 */
async function searchNearAddress(address, type, options = {}) {
  const { limit = 10, radius = 1000 } = options;
  
  // First geocode the address
  const location = await geocodeAddress(address);
  
  const poiType = POI_TYPES[type.toLowerCase()];
  if (!poiType) {
    throw new Error(`Unknown POI type: ${type}`);
  }
  
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="${poiType.amenity}"](around:${radius},${location.lat},${location.lon});
      way["amenity"="${poiType.amenity}"](around:${radius},${location.lat},${location.lon});
    );
    out center ${limit};
  `;
  
  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  
  const data = await res.json();
  
  const pois = (data.elements || []).map(el => ({
    id: el.id,
    name: el.tags?.name || poiType.label,
    type: poiType.label,
    lat: el.lat || el.center?.lat,
    lon: el.lon || el.center?.lon,
    distance: calculateDistance(location.lat, location.lon, el.lat || el.center?.lat, el.lon || el.center?.lon),
    address: formatAddress(el.tags),
    additional: formatAdditional(el.tags)
  }));
  
  // Sort by distance
  pois.sort((a, b) => a.distance - b.distance);
  
  return {
    pois,
    location: {
      address: location.display_name,
      lat: location.lat,
      lon: location.lon
    }
  };
}

function formatAddress(tags) {
  if (!tags['addr:street']) return null;
  const street = tags['addr:housenumber'] ? `${tags['addr:street']} ${tags['addr:housenumber']}` : tags['addr:street'];
  const city = tags['addr:city'] || tags['addr:suburb'];
  return `${street}, ${city}`;
}

function formatAdditional(tags) {
  const info = [];
  if (tags['opening_hours']) info.push(`🕐 ${tags['opening_hours']}`);
  if (tags['cuisine']) info.push(`🍴 ${tags['cuisine']}`);
  if (tags['website']) info.push(`🌐 ${tags['website']}`);
  if (tags['phone']) info.push(`📞 ${tags['phone']}`);
  return info;
}

// Haversine distance in meters
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

module.exports = {
  searchPOIs,
  searchNearAddress,
  geocodeAddress,
  POI_TYPES
};
