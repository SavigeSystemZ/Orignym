"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReportAction(claimId: string, formData: FormData) {
  const reason = formData.get("reason") as string;
  const email = formData.get("email") as string;

  if (!reason) throw new Error("Reason is required");

  await prisma.report.create({
    data: {
      claim_id: claimId,
      reason,
      reporter_email: email || "anonymous"
    }
  });

  revalidatePath(`/registry/${claimId}`);
}
