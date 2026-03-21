-- AlterTable
ALTER TABLE "VerificationRun" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "confidence_score" DOUBLE PRECISION,
ADD COLUMN     "limitations_note" TEXT,
ADD COLUMN     "model_used" TEXT,
ADD COLUMN     "prompt_version" TEXT,
ADD COLUMN     "provider_used" TEXT,
ADD COLUMN     "search_strategy_version" TEXT,
ADD COLUMN     "summary_reasons" TEXT,
ADD COLUMN     "verdict_tier" TEXT;

-- CreateTable
CREATE TABLE "EvidenceItem" (
    "evidence_id" TEXT NOT NULL,
    "verification_run_id" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_label" TEXT NOT NULL,
    "source_url_identifier" TEXT,
    "matched_text_snippet" TEXT,
    "classification" TEXT NOT NULL,
    "relevance_score" DOUBLE PRECISION NOT NULL,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenceItem_pkey" PRIMARY KEY ("evidence_id")
);

-- CreateTable
CREATE TABLE "AIProviderRun" (
    "id" TEXT NOT NULL,
    "verification_run_id" TEXT,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "prompt_version" TEXT NOT NULL,
    "duration_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIProviderRun_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EvidenceItem" ADD CONSTRAINT "EvidenceItem_verification_run_id_fkey" FOREIGN KEY ("verification_run_id") REFERENCES "VerificationRun"("run_id") ON DELETE CASCADE ON UPDATE CASCADE;
