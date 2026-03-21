"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClaim(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found");

  const data = {
    user_id: user.id,
    proposed_term: formData.get("proposed_term") as string,
    normalized_term: (formData.get("proposed_term") as string).toLowerCase().trim(),
    pronunciation_hint: formData.get("pronunciation_hint") as string,
    language_locale: formData.get("language_locale") as string,
    intended_meaning: formData.get("intended_meaning") as string,
    domain_category: formData.get("domain_category") as string,
    description_use_context: formData.get("description_use_context") as string,
  };

  await prisma.coinedTermClaim.create({ data });
  revalidatePath("/claims");
  redirect("/claims");
}

export async function updateClaim(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const data = {
    proposed_term: formData.get("proposed_term") as string,
    normalized_term: (formData.get("proposed_term") as string).toLowerCase().trim(),
    pronunciation_hint: formData.get("pronunciation_hint") as string,
    language_locale: formData.get("language_locale") as string,
    intended_meaning: formData.get("intended_meaning") as string,
    domain_category: formData.get("domain_category") as string,
    description_use_context: formData.get("description_use_context") as string,
  };

  await prisma.coinedTermClaim.update({
    where: { claim_id: id },
    data
  });
  revalidatePath("/claims");
  redirect("/claims");
}

export async function deleteClaim(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  await prisma.coinedTermClaim.delete({
    where: { claim_id: id }
  });
  revalidatePath("/claims");
}
