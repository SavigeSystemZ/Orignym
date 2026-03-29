-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- AlterTable
ALTER TABLE "CoinedTermClaim" ADD COLUMN "semantic_embedding" vector(768);

-- CreateIndex
CREATE INDEX "CoinedTermClaim_normalized_term_trgm_idx" ON "CoinedTermClaim" USING GIN ("normalized_term" gin_trgm_ops);
CREATE INDEX "CoinedTermClaim_proposed_term_trgm_idx" ON "CoinedTermClaim" USING GIN ("proposed_term" gin_trgm_ops);