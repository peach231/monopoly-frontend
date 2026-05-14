const { v4: uuidv4 } = require('uuid');
const { censorMessage } = require('./chatFilter');

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
