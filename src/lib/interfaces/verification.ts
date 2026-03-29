export type VerdictTier = 
  | 'no_strong_conflict_found'
  | 'possible_conflict_detected'
  | 'strong_conflict_detected'
  | 'insufficient_evidence'
  | 'needs_human_review';

export interface EvidenceItem {
  id: string;
  sourceType: string;
  sourceLabel: string;
  sourceUrlIdentifier?: string;
  matchedTextSnippet: string;
  classification: 'exact' | 'near' | 'phonetic' | 'semantic';
  relevanceScore: number;
}

export interface VerificationVerdict {
  tier: VerdictTier;
  confidenceScore: number;
  reasons: string;
  limitationsNote: string;
  evidenceItems: EvidenceItem[];
}

export interface VerificationService {
  verifyClaim(claimId: string): Promise<VerificationVerdict>;
}
