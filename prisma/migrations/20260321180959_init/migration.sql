-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinedTermClaim" (
    "claim_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "proposed_term" TEXT NOT NULL,
    "normalized_term" TEXT NOT NULL,
    "pronunciation_hint" TEXT,
    "language_locale" TEXT NOT NULL,
    "intended_meaning" TEXT NOT NULL,
    "domain_category" TEXT NOT NULL,
    "description_use_context" TEXT NOT NULL,
    "claimed_first_use_date" TIMESTAMP(3),
    "visibility_state" TEXT NOT NULL DEFAULT 'private',
    "publication_state" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoinedTermClaim_pkey" PRIMARY KEY ("claim_id")
);

-- CreateTable
CREATE TABLE "VerificationRun" (
    "run_id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRun_pkey" PRIMARY KEY ("run_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "CoinedTermClaim" ADD CONSTRAINT "CoinedTermClaim_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRun" ADD CONSTRAINT "VerificationRun_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "CoinedTermClaim"("claim_id") ON DELETE RESTRICT ON UPDATE CASCADE;
