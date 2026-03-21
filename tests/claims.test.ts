import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClaim, updateClaim, deleteClaim } from '../src/lib/actions/claims';

// Mock NextAuth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(() => Promise.resolve({
    user: { email: 'test@example.com' }
  }))
}));

// Mock revalidatePath & redirect
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));
vi.mock('next/navigation', () => ({
  redirect: vi.fn()
}));

// Mock Prisma
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockFindUniqueUser = vi.fn(() => Promise.resolve({ id: 'user-1' }));

vi.mock('../src/lib/prisma', () => ({
  default: {
    user: {
      findUnique: (...args: any[]) => mockFindUniqueUser(...args)
    },
    coinedTermClaim: {
      create: (...args: any[]) => mockCreate(...args),
      update: (...args: any[]) => mockUpdate(...args),
      delete: (...args: any[]) => mockDelete(...args)
    }
  }
}));

describe('Claim Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a claim', async () => {
    const formData = new FormData();
    formData.append('proposed_term', 'TestTerm');
    formData.append('language_locale', 'en-US');
    formData.append('domain_category', 'Tech');
    formData.append('intended_meaning', 'A test term');
    formData.append('description_use_context', 'In tests');

    await createClaim(formData);

    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        user_id: 'user-1',
        proposed_term: 'TestTerm',
        normalized_term: 'testterm'
      })
    });
  });

  it('should update a claim', async () => {
    const formData = new FormData();
    formData.append('proposed_term', 'UpdatedTerm');
    formData.append('language_locale', 'en-US');
    formData.append('domain_category', 'Tech');
    formData.append('intended_meaning', 'An updated test term');
    formData.append('description_use_context', 'In tests');

    await updateClaim('claim-1', formData);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { claim_id: 'claim-1' },
      data: expect.objectContaining({
        proposed_term: 'UpdatedTerm',
        normalized_term: 'updatedterm'
      })
    });
  });

  it('should delete a claim', async () => {
    await deleteClaim('claim-1');

    expect(mockDelete).toHaveBeenCalledWith({
      where: { claim_id: 'claim-1' }
    });
  });
});
