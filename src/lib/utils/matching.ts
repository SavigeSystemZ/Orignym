import { doubleMetaphone } from 'double-metaphone';
import stringSimilarity from 'string-similarity';

export interface PhoneticCode {
  primary: string;
  secondary: string | null;
}

/**
 * Generates primary and secondary phonetic codes for a given term.
 * Useful for finding near-matches that sound similar but are spelled differently.
 */
export function getPhoneticCodes(term: string): PhoneticCode {
  // doubleMetaphone returns [primary, secondary]
  const [primary, secondary] = doubleMetaphone(term);
  return {
    primary,
    secondary: secondary || null,
  };
}

/**
 * Calculates the Levenshtein-based similarity score between two strings.
 * Returns a value between 0 (completely different) and 1 (exact match).
 */
export function calculateSimilarity(term1: string, term2: string): number {
  if (!term1 || !term2) return 0;
  return stringSimilarity.compareTwoStrings(term1.toLowerCase(), term2.toLowerCase());
}

/**
 * Checks if two terms are phonetically similar by comparing their primary and secondary codes.
 */
export function arePhoneticallySimilar(term1: string, term2: string): boolean {
  const codes1 = getPhoneticCodes(term1);
  const codes2 = getPhoneticCodes(term2);
  
  if (codes1.primary === codes2.primary) return true;
  if (codes1.secondary && codes2.secondary && codes1.secondary === codes2.secondary) return true;
  if (codes1.primary === codes2.secondary) return true;
  if (codes1.secondary === codes2.primary) return true;
  
  return false;
}
