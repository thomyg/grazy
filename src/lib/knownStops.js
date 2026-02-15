/**
 * Bekannte Haltestellen-IDs für Graz
 * Wird für Suche verwendet wenn Name nicht eindeutig
 */

const KNOWN_STOPS = {
  'hauptbahnhof': '63203040',
  'bahnhof': '63203040',
  'fh joanneum': '63207960',
  'fh': '63207960',
  'joanneum': '63207960',
  'stadion': '63203198',
  'münzgraben': '63203198',
  'merkur arena': '63203198',
  'stadion liebenau': '63203023',
  'liebenau': '63203023',
  'lkh med uni': '63203001',
  'med uni': '63203001',
  'jakominiplatz': '63203010',
  'reininghaus': '63203065',
  'murpark': '63203023',
  'eggenberg': '63203040',
  'wissenschaftspark': '63203001',
  'kunstuniversität': '63203001'
};

function resolveStopId(input) {
  const lower = input.toLowerCase().trim();
  
  // Prüfe bekannte Namen
  for (const [key, id] of Object.entries(KNOWN_STOPS)) {
    if (lower.includes(key)) {
      return id;
    }
  }
  
  // Prüfe ob es bereits eine numerische ID ist
  const num = parseInt(input.replace(/\D/g, ''));
  if (!isNaN(num) && num > 1000000) {
    return input.replace(/\D/g, '');
  }
  
  return null; // Muss gesucht werden
}

module.exports = {
  KNOWN_STOPS,
  resolveStopId
};
