/**
 * Known Stops for Graz
 * Used for fuzzy matching when API fails
 */

const KNOWN_STOPS = {
  // Main Station
  'hauptbahnhof': '63203040',
  'bahnhof': '63203040',
  'graz hauptbahnhof': '63203040',
  
  // University
  'fh joanneum': '63207960',
  'fh': '63207960',
  'joanneum': '63207960',
  'universität': '63207960',
  
  // Stadium
  'stadion': '63203198',
  'münzgraben': '63203198',
  'münzgrabenstraße': '63203198',
  'merkur arena': '63203198',
  'stadion münzgraben': '63203198',
  
  // Liebenau
  'stadion liebenau': '63203023',
  'liebenau': '63203023',
  'murpark': '63203023',
  
  // Medical
  'lkh med uni': '63203001',
  'med uni': '63203001',
  'lkh': '63203001',
  'medizinisches universität': '63203001',
  
  // Central
  'jakominiplatz': '63203047',
  'jakomini': '63203047',
  
  // Other
  'reininghaus': '63203065',
  'eggenberg': '63203040',
  'wissenschaftspark': '63203001',
  'kunstuniversität': '63203001',
  'oper': '63203048',
  'kaiser josef platz': '63203048'
};

function resolveStopId(input) {
  const lower = input.toLowerCase().trim();
  
  // Check known names
  for (const [key, id] of Object.entries(KNOWN_STOPS)) {
    if (lower.includes(key)) {
      return id;
    }
  }
  
  // Check if it's already a numeric ID
  const num = parseInt(input.replace(/\D/g, ''));
  if (!isNaN(num) && num > 1000000) {
    return input.replace(/\D/g, '');
  }
  
  return null; // Need to search
}

module.exports = {
  KNOWN_STOPS,
  resolveStopId
};
