import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface SearchFilters {
  query?: string;
  domain?: string;
  verdictTier?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export class RegistrySearchService {
  /**
   * Performs a faceted search across the registry using Prisma.
   * If trigram extensions (pg_trgm) are active in DB, `contains` maps to ILIKE which uses GIN/GIST indexes.
   */
  static async search(filters: SearchFilters, limit = 50) {
    const where: Prisma.CoinedTermClaimWhereInput = {
      publication_state: 'published',
      visibility_state: 'public',
      is_frozen: false,
    };

    if (filters.query) {
      where.OR = [
        { normalized_term: { contains: filters.query, mode: 'insensitive' } },
        { proposed_term: { contains: filters.query, mode: 'insensitive' } },
        { intended_meaning: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    if (filters.domain) {
      where.domain_category = { equals: filters.domain, mode: 'insensitive' };
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    // Filter by verdict tier requires joining verification_runs
    if (filters.verdictTier) {
      where.verification_runs = {
        some: {
          status: 'completed',
          verdict_tier: filters.verdictTier
        }
      };
    }

    const claims = await prisma.coinedTermClaim.findMany({
      where,
      include: {
        verification_runs: {
          where: { status: 'completed' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return claims;
  }
}
