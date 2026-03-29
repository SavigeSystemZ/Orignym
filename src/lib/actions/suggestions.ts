"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SuggestionService } from "@/lib/suggestions/service";
import { PersonalisationContext } from "@/lib/interfaces/ai";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function generateSuggestionsAction(claimId: string, formData?: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  let personalisation: PersonalisationContext | undefined = undefined;

  if (formData) {
    personalisation = {
      tone: formData.get("tone") as string,
      linguisticDiversity: formData.get("diversity") as string,
      maxLength: formData.get("maxLength") ? parseInt(formData.get("maxLength") as string) : 15,
    };
  }

  const service = new SuggestionService();
  await service.generateAndPersistSuggestions(claimId, personalisation);

  revalidatePath(`/claims/${claimId}/suggestions`);
  redirect(`/claims/${claimId}/suggestions`);
}

export async function rateSuggestionAction(suggestionId: string, rating: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const updated = await prisma.suggestedAlternative.update({
    where: { id: suggestionId },
    data: { user_rating: rating }
  });

  revalidatePath(`/claims/${updated.claim_id}/suggestions`);
}

export async function acceptSuggestionAction(claimId: string, suggestionId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const suggestion = await prisma.suggestedAlternative.findUnique({
    where: { id: suggestionId }
  });

  if (!suggestion || suggestion.claim_id !== claimId) throw new Error("Invalid suggestion");

  // Atomic update: accept suggestion and update the claim's proposed term
  await prisma.$transaction([
    prisma.suggestedAlternative.update({
      where: { id: suggestionId },
      data: { state: 'accepted', user_rating: 5 }
    }),
    prisma.coinedTermClaim.update({
      where: { claim_id: claimId },
      data: {
        proposed_term: suggestion.term,
        normalized_term: suggestion.term.toLowerCase().trim()
      }
    }),
    // Reset any other accepted suggestions back to suggested if we only allow one accepted one
    prisma.suggestedAlternative.updateMany({
      where: {
        claim_id: claimId,
        id: { not: suggestionId },
        state: 'accepted'
      },
      data: { state: 'suggested' }
    })
  ]);

  revalidatePath(`/claims/${claimId}/suggestions`);
  revalidatePath(`/claims`);
  redirect(`/claims`);
}

export async function rejectSuggestionAction(suggestionId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const updated = await prisma.suggestedAlternative.update({
    where: { id: suggestionId },
    data: { state: 'rejected', user_rating: 1 }
  });

  revalidatePath(`/claims/${updated.claim_id}/suggestions`);
}
