import Link from "next/link";
import prisma from "@/lib/prisma";
import type { CoinedTermClaim, VerificationRun } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Plus, Trash2, Edit, Globe } from "lucide-react";
import { deleteClaim } from "@/lib/actions/claims";
import { publishClaimAction } from "@/lib/actions/publish";

export default async function ClaimsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return null;

  const claims = await prisma.coinedTermClaim.findMany({ 
    where: { user_id: user.id },
    include: { verification_runs: { where: { status: 'completed' } } }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Draft Claims</h2>
        <Link href="/claims/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          <span>New Claim</span>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {claims.map((claim: CoinedTermClaim & { verification_runs: VerificationRun[] }) => (
              <tr key={claim.claim_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{claim.proposed_term}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.domain_category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${claim.publication_state === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {claim.publication_state}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3 items-center">
                    {claim.publication_state === 'draft' && claim.verification_runs.length > 0 && (
                      <form action={async () => {
                        "use server";
                        await publishClaimAction(claim.claim_id);
                      }}>
                        <button type="submit" className="text-blue-600 hover:text-blue-900 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded" title="Publish to Registry">
                          <Globe size={16} /> Publish
                        </button>
                      </form>
                    )}
                    <Link href={`/claims/${claim.claim_id}`} className="text-indigo-600 hover:text-indigo-900">
                      <Edit size={18} />
                    </Link>
                    <form action={async () => {
                      "use server";
                      await deleteClaim(claim.claim_id);
                    }}>
                      <button type="submit" className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {claims.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No draft claims found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
