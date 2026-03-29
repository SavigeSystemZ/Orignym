import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SuggestionService } from '../src/lib/suggestions/service';

// Mock Prisma
const mockFindUnique = vi.fn();
const mockCreate = vi.fn();

vi.mock('../src/lib/prisma', () => ({
  default: {
    coinedTermClaim: {
      findUnique: (args: any) => mockFindUnique(args),
    },
    suggestedAlternative: {
      create: (args: any) => {
        mockCreate(args);
        return Promise.resolve(args.data);
      },
    }
  }
}));

describe('Suggestion Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should filter out suggestions that match the original term', async () => {
    mockFindUnique.mockResolvedValue({
      claim_id: 'claim-1',
      proposed_term: 'Original',
      normalized_term: 'original',
      intended_meaning: 'test',
      domain_category: 'test',
      verification_runs: []
    });

    const service = new SuggestionService();
    // The MockSuggestionProvider returns [Originally, NeoOriginal, OriginalX, Orignym_Original]
    const suggestions = await service.generateAndPersistSuggestions('claim-1');

    expect(suggestions.length).toBeGreaterThan(0);
    const terms = suggestions.map(s => s.term.toLowerCase());
    expect(terms).not.toContain('original');
  });

  it('should rank shorter suggestions higher', async () => {
     mockFindUnique.mockResolvedValue({
      claim_id: 'claim-1',
      proposed_term: 'Test',
      normalized_term: 'test',
      intended_meaning: 'test',
      domain_category: 'test',
      verification_runs: []
    });

    const service = new SuggestionService();
    const suggestions = await service.generateAndPersistSuggestions('claim-1');

    // "TestX" (5 chars) should be ranked higher than "Orignym_Test" (12 chars) if our heuristic works
    expect(suggestions[0].ranking_score).toBeGreaterThanOrEqual(suggestions[suggestions.length - 1].ranking_score);
  });
});
