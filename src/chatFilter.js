// ============================================
// CHAT FILTER — Conservative, hardcoded word list
// ============================================

const BAD_WORDS = [
  'nigger', 'nigga', 'chink', 'gook', 'spic', 'wetback', 'kike', 'dyke',
  'faggot', 'fag', 'retard', 'retarded',
  'rape', 'rapist', 'molest', 'pedo', 'pedophile',
  'fuck', 'fucking', 'fucked', 'fucker', 'shit', 'shitting', 'shitted',
  'bitch', 'bitching', 'bastard', 'damnit', 'cunt', 'cock', 'dick',
  'pussy', 'asshole', 'whore', 'slut', 'cum', 'jizz',
  'fuk', 'fck', 'sh1t', 'b1tch', 'd1ck', 'c0ck', 'n1gger', 'n1gga',
  'fuking', 'fcking', 'fuker', 'fcker',
];

const _escapedWords = BAD_WORDS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const FILTER_REGEX = new RegExp('\\b(' + _escapedWords.join('|') + ')\\b', 'gi');

export function censorMessage(text) {
  if (!text || typeof text !== 'string') return { censored: text || '', wasFiltered: false };
  let wasFiltered = false;
  const censored = text.replace(FILTER_REGEX, (match) => {
    wasFiltered = true;
    return '*'.repeat(match.length);
  });
  return { censored, wasFiltered };
}
