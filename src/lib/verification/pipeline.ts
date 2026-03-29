import prisma from "@/lib/prisma";
import { VerificationVerdict, VerificationService } from "@/lib/interfaces/verification";
import { normalizeTerm } from "./stages/normalization";
import { checkExactMatch } from "./stages/exact";
import { checkNearMatch } from "./stages/near";
import { checkPhoneticMatch } from "./stages/phonetic";
import { checkSemanticMatch } from "./stages/semantic";
import { synthesizeEvidence } from "./stages/synthesis";
import { checkWikipedia } from "./providers/wikipedia";
import { checkDomainAvailability } from "./providers/domain";
import { checkTrademarkDatabase } from "./providers/trademark";
import { AIProviderFactory } from "../ai/factory";

export class StagedVerificationService implements VerificationService {
  async verifyClaim(claimId: string): Promise<VerificationVerdict> {
    const claim = await prisma.coinedTermClaim.findUnique({ where: { claim_id: claimId } });
    if (!claim) throw new Error("Claim not found");

    const run = await prisma.verificationRun.create({
      data: {
        claim_id: claim.claim_id,
        status: "in_progress",
        provider_used: process.env.AI_PROVIDER || "google",
        model_used: "gemini-1.5-pro",
      }
    });

    try {
      const normalized = normalizeTerm(claim.proposed_term);

      const exactEvidence = await checkExactMatch(normalized.normalizedString, claim.domain_category);
      const nearEvidence = await checkNearMatch(normalized.normalizedString, claim.domain_category);
      const phoneticEvidence = await checkPhoneticMatch(normalized.phoneticPrimary, normalized.phoneticSecondary);
      
      const wikipediaEvidence = await checkWikipedia(claim.proposed_term);
      const domainEvidence = await checkDomainAvailability(claim.proposed_term);
      const trademarkEvidence = await checkTrademarkDatabase(claim.proposed_term, claim.domain_category);

      const llmProvider = AIProviderFactory.getLLMProvider();
      const semanticEvidence = await checkSemanticMatch(claim.proposed_term, claim.intended_meaning, claim.domain_category, llmProvider);

      const allEvidence = [
        ...exactEvidence, 
        ...nearEvidence, 
        ...phoneticEvidence, 
        ...wikipediaEvidence, 
        ...domainEvidence,
        ...trademarkEvidence,
        ...semanticEvidence
      ];

      const structProvider = AIProviderFactory.getStructuredOutputProvider(allEvidence);
      const verdict = await synthesizeEvidence(claim.proposed_term, allEvidence, structProvider);

      for (const ev of verdict.evidenceItems) {
        await prisma.evidenceItem.create({
          data: {
            verification_run_id: run.run_id,
            source_type: ev.sourceType,
            source_label: ev.sourceLabel,
            source_url_identifier: ev.sourceUrlIdentifier,
            matched_text_snippet: ev.matchedTextSnippet,
            classification: ev.classification,
            relevance_score: ev.relevanceScore,
          }
        });
      }

      await prisma.verificationRun.update({
        where: { run_id: run.run_id },
        data: {
          status: "completed",
          verdict_tier: verdict.tier,
          confidence_score: verdict.confidenceScore,
          summary_reasons: verdict.reasons,
          limitations_note: verdict.limitationsNote,
          completedAt: new Date(),
        }
      });

      await prisma.aIProviderRun.create({
        data: {
          verification_run_id: run.run_id,
          provider: "mock_ai",
          model: "mock_v1",
          prompt_version: "v1.0.0",
        }
      });

      return verdict;

    } catch (e) {
      await prisma.verificationRun.update({
        where: { run_id: run.run_id },
        data: { status: "failed" }
      });
      throw e;
    }
  }
}
