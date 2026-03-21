import { StructuredOutputProvider } from "@/lib/interfaces/ai";
import { VerificationVerdict, EvidenceItem } from "@/lib/interfaces/verification";

export async function synthesizeEvidence(
  term: string,
  evidence: Partial<EvidenceItem>[],
  aiProvider: StructuredOutputProvider
): Promise<VerificationVerdict> {
  const prompt = `
    Analyze the following evidence for the coined term "${term}".
    Produce a structured verification verdict.
    Evidence: ${JSON.stringify(evidence)}
  `;

  const schema = {
    type: "object",
    properties: {
      tier: { type: "string", enum: ["no_strong_conflict_found", "possible_conflict_detected", "strong_conflict_detected", "insufficient_evidence", "needs_human_review"] },
      confidenceScore: { type: "number" },
      reasons: { type: "string" },
      limitationsNote: { type: "string" }
    },
    required: ["tier", "confidenceScore", "reasons", "limitationsNote"]
  };

  const result = await aiProvider.generateObject<VerificationVerdict>(prompt, schema);
  
  result.evidenceItems = evidence.map((e, idx) => ({
    id: `ev-${idx}`,
    sourceType: e.sourceType || 'unknown',
    sourceLabel: e.sourceLabel || 'unknown',
    matchedTextSnippet: e.matchedTextSnippet || '',
    classification: (e.classification || 'semantic') as 'exact' | 'near' | 'phonetic' | 'semantic',
    relevanceScore: e.relevanceScore || 0,
  }));

  result.limitationsNote = result.limitationsNote || "This verification does not grant legal ownership, guarantee originality, or provide trademark clearance. It is based solely on the sources checked at this time.";

  return result;
}
