import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { validateApiKey } from '@/lib/api/middleware';
import { normalizeTerm } from '@/lib/verification/stages/normalization';

export async function GET(request: NextRequest) {
  const auth = await validateApiKey(request);
  if (auth.error || !auth.apiKey) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    // Fetch claims belonging to the organization that owns the API key
    const claims = await prisma.coinedTermClaim.findMany({
      where: { organization_id: auth.apiKey.organization_id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ data: claims });
  } catch (error) {
    console.error("API Claims GET Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await validateApiKey(request);
  if (auth.error || !auth.apiKey) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.proposed_term || !body.intended_meaning || !body.domain_category) {
      return NextResponse.json({ error: 'Missing required fields: proposed_term, intended_meaning, domain_category' }, { status: 400 });
    }

    const normalized = normalizeTerm(body.proposed_term);

    // To create a claim, we need a user_id. For API keys, we can assign it to the org owner
    // or a dedicated service account. We'll find the first owner of the org.
    const owner = await prisma.organizationMember.findFirst({
      where: { organization_id: auth.apiKey.organization_id, role: 'OWNER' }
    });

    if (!owner) {
      return NextResponse.json({ error: 'Organization has no valid owner to assign the claim.' }, { status: 400 });
    }

    const claim = await prisma.coinedTermClaim.create({
      data: {
        proposed_term: body.proposed_term,
        normalized_term: normalized.normalizedString,
        pronunciation_hint: body.pronunciation_hint,
        language_locale: body.language_locale || 'en-US',
        intended_meaning: body.intended_meaning,
        domain_category: body.domain_category,
        description_use_context: body.description_use_context || body.intended_meaning,
        user_id: owner.user_id,
        organization_id: auth.apiKey.organization_id,
        visibility_state: 'private', // API defaults to private draft
        publication_state: 'draft'
      }
    });

    return NextResponse.json({ data: claim }, { status: 201 });
  } catch (error) {
    console.error("API Claims POST Error:", error);
    return NextResponse.json({ error: 'Internal Server Error or Invalid JSON' }, { status: 500 });
  }
}
