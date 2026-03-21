import { doubleMetaphone } from 'double-metaphone';

export function normalizeTerm(term: string) {
  const lowercase = term.toLowerCase();
  const normalizedPunctuation = lowercase.replace(/[^a-z0-9]/g, '');
  const [primaryMetaphone, secondaryMetaphone] = doubleMetaphone(normalizedPunctuation);

  return {
    lowercase,
    normalizedString: normalizedPunctuation,
    phoneticPrimary: primaryMetaphone,
    phoneticSecondary: secondaryMetaphone,
  };
}
