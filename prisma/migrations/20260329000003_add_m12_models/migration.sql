-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_flagged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimAnalytics" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "profile_views" INTEGER NOT NULL DEFAULT 0,
    "search_impressions" INTEGER NOT NULL DEFAULT 0,
    "last_viewed_at" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClaimAnalytics_claim_id_key" ON "ClaimAnalytics"("claim_id");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "CoinedTermClaim"("claim_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimAnalytics" ADD CONSTRAINT "ClaimAnalytics_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "CoinedTermClaim"("claim_id") ON DELETE CASCADE ON UPDATE CASCADE;