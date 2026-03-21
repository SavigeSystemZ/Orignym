"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.email === process.env.ADMIN_EMAIL || session?.user?.email === "admin@orignym.local";
}

export async function freezeClaimAction(claimId: string) {
  if (!await isAdmin()) throw new Error("Unauthorized");

  await prisma.coinedTermClaim.update({
    where: { claim_id: claimId },
    data: { is_frozen: true }
  });

  await prisma.auditEvent.create({
    data: {
      actor: "admin",
      action: "freeze_claim",
      target_id: claimId,
    }
  });

  revalidatePath("/admin");
}

export async function unpublishClaimAction(claimId: string) {
  if (!await isAdmin()) throw new Error("Unauthorized");

  await prisma.coinedTermClaim.update({
    where: { claim_id: claimId },
    data: { 
      publication_state: 'draft',
      visibility_state: 'private'
    }
  });

  await prisma.auditEvent.create({
    data: {
      actor: "admin",
      action: "unpublish_claim",
      target_id: claimId,
    }
  });

  revalidatePath("/admin");
}

export async function resolveReportAction(reportId: string) {
  if (!await isAdmin()) throw new Error("Unauthorized");

  await prisma.report.update({
    where: { id: reportId },
    data: { status: 'resolved' }
  });

  revalidatePath("/admin");
}
