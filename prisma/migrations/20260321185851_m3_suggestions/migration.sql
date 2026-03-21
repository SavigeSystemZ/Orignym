-- CreateTable
CREATE TABLE "SuggestedAlternative" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "ranking_score" DOUBLE PRECISION NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'suggested',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuggestedAlternative_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SuggestedAlternative" ADD CONSTRAINT "SuggestedAlternative_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "CoinedTermClaim"("claim_id") ON DELETE CASCADE ON UPDATE CASCADE;
