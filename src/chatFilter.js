// ============================================
// CHAT FILTER — Conservative, hardcoded word list
// ============================================

// Core slurs + profanity. Leans conservative — only obvious matches.
// Uses word-boundary regex to avoid false positives.
const BAD_WORDS = [
  // Racial/ethnic slurs
  'nigger', 'nigga', 'chink', 'gook', 'spic', 'wetback', 'kike', 'dyke',
  'faggot', 'fag', 'retard', 'retarded',
  // Sexual/harassment
  'rape', 'rapist', 'molest', 'pedo', 'pedophile',
  // Profanity
  'fuck', 'fucking', 'fucked', 'fucker', 'shit', 'shitting', 'shitted',
  'bitch', 'bitching', 'bastard', 'damnit', 'cunt', 'cock', 'dick',
  'pussy', 'asshole', 'whore', 'slut', 'cum', 'jizz',
  // Variants with common substitutions
  'fuk', 'fck', 'sh1t', 'b1tch', 'd1ck', 'c0ck', 'n1gger', 'n1gga',
  'fuking', 'fcking', 'fuker', 'fcker',
];

// Build regex with word boundaries — case insensitive
const escapedWords = BAD_WORDS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const FILTER_REGEX = new RegExp('\\b(' + escapedWords.join('|') + ')\\b', 'gi');

/**
 * Censors a message by replacing bad words with *** matching the original length.
 * Returns { censored: string, wasFiltered: boolean }
 */
export function censorMessage(text) {
  if (!text || typeof text !== 'string') return { censored: text || '', wasFiltered: false };

  let wasFiltered = false;
  const censored = text.replace(FILTER_REGEX, (match) => {
    wasFiltered = true;
    return '*'.repeat(match.length);
  });

  return { censored, wasFiltered };
}

/**
 * Server-side version (same logic, CommonJS export)
 */
function censorMessageNode(text) {
  if (!text || typeof text !== 'string') return { censored: text || '', wasFiltered: false };

  let wasFiltered = false;
  const censored = text.replace(FILTER_REGEX, (match) => {
    wasFiltered = true;
    return '*'.repeat(match.length);
  });

  return { censored, wasFiltered };
}

module.exports = { censorMessage: censorMessageNode };
