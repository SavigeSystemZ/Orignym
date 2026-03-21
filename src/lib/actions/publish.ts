"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function publishClaimAction(claimId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const claim = await prisma.coinedTermClaim.findUnique({
    where: { claim_id: claimId },
    include: { verification_runs: { where: { status: 'completed' } } }
  });

  if (!claim) throw new Error("Claim not found");

  if (claim.verification_runs.length === 0) {
    throw new Error("A completed verification run is required before publishing.");
  }

  await prisma.coinedTermClaim.update({
    where: { claim_id: claimId },
    data: {
      publication_state: 'published',
      visibility_state: 'public'
    }
  });

  revalidatePath("/claims");
  revalidatePath("/registry");
  redirect(`/registry/${claimId}`);
}
