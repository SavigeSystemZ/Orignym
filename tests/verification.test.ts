import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeTerm } from '../src/lib/verification/stages/normalization';
import { StagedVerificationService } from '../src/lib/verification/pipeline';

// Mock Prisma
const mockFindUnique = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockEvidenceCreate = vi.fn();
const mockAuditCreate = vi.fn();

vi.mock('../src/lib/prisma', () => ({
  default: {
    coinedTermClaim: {
      findUnique: (args: any) => mockFindUnique(args)
    },
    verificationRun: {
      create: (args: any) => mockCreate(args),
      update: (args: any) => mockUpdate(args),
    },
    evidenceItem: {
      create: (args: any) => mockEvidenceCreate(args),
    },
    aIProviderRun: {
      create: (args: any) => mockAuditCreate(args),
    }
  }
}));

describe('Verification Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Stage A: Normalization', () => {
    it('should lowercase and strip punctuation', () => {
      const result = normalizeTerm('Orignym-App!');
      expect(result.normalizedString).toBe('orignymapp');
    });

    it('should generate phonetic codes', () => {
      const result = normalizeTerm('Orignym');
      expect(result.phoneticPrimary).toBeDefined();
    });
  });

  describe('Pipeline Integration', () => {
    it('should complete a verification run', async () => {
      mockFindUnique.mockResolvedValue({
        claim_id: 'claim-1',
        proposed_term: 'NewWord',
        intended_meaning: 'A test word',
        domain_category: 'Test'
      });

      mockCreate.mockResolvedValue({ run_id: 'run-1' });

      const service = new StagedVerificationService();
      const verdict = await service.verifyClaim('claim-1');

      expect(verdict.tier).toBeDefined();
      expect(mockCreate).toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        where: { run_id: 'run-1' },
        data: expect.objectContaining({ status: 'completed' })
      }));
    });
  });
});
