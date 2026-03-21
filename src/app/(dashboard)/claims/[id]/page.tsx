import { updateClaim } from "@/lib/actions/claims";
import ClaimForm from "@/components/ClaimForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditClaimPage({ params }: { params: { id: string } }) {
  const claim = await prisma.coinedTermClaim.findUnique({
    where: { claim_id: params.id }
  });

  if (!claim) return notFound();

  const updateClaimWithId = updateClaim.bind(null, claim.claim_id);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Claim</h2>
      <ClaimForm action={updateClaimWithId} initialData={claim} />
    </div>
  );
}
