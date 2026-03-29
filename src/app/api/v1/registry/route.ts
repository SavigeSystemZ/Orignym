import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey } from '@/lib/api/middleware';
import { RegistrySearchService } from '@/lib/search/service';

export async function GET(request: NextRequest) {
  const auth = await validateApiKey(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || undefined;
  const domain = searchParams.get('domain') || undefined;
  const verdictTier = searchParams.get('verdict_tier') || undefined;
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam) : 50;

  try {
    const claims = await RegistrySearchService.search({
      query,
      domain,
      verdictTier
    }, Math.min(limit, 100)); // Cap at 100 for API

    // Map to public DTO
    const data = claims.map(claim => ({
      id: claim.claim_id,
      term: claim.proposed_term,
      normalized_term: claim.normalized_term,
      domain: claim.domain_category,
      meaning: claim.intended_meaning,
      created_at: claim.createdAt,
      latest_verification: claim.verification_runs[0] ? {
        status: claim.verification_runs[0].status,
        verdict: claim.verification_runs[0].verdict_tier,
        confidence: claim.verification_runs[0].confidence_score,
        date: claim.verification_runs[0].completedAt
      } : null
    }));

    return NextResponse.json({ data, meta: { total: data.length, limit } });
  } catch (error) {
    console.error("API Registry Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
