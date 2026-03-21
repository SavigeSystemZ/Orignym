"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StagedVerificationService } from "@/lib/verification/pipeline";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function runVerification(claimId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const service = new StagedVerificationService();
  await service.verifyClaim(claimId);

  revalidatePath(`/verification`);
  redirect(`/verification`);
}
