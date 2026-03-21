import { createClaim } from "@/lib/actions/claims";
import ClaimForm from "@/components/ClaimForm";

export default function NewClaimPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Claim</h2>
      <ClaimForm action={createClaim} />
    </div>
  );
}
