import Link from "next/link";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { runVerification } from "@/lib/actions/verification";

export default async function VerificationPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return null;

  const claims = await prisma.coinedTermClaim.findMany({ 
    where: { user_id: user.id },
    include: { verification_runs: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Verification Runs</h2>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verdict</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {claims.map((claim) => {
              const latestRun = claim.verification_runs[0];
              return (
                <tr key={claim.claim_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{claim.proposed_term}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {latestRun ? latestRun.status : 'Not Started'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {latestRun?.verdict_tier ? latestRun.verdict_tier.replace(/_/g, ' ') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {latestRun ? (
                      <div className="flex gap-4 justify-end">
                        <Link href={`/verification/${latestRun.run_id}`} className="text-indigo-600 hover:text-indigo-900">
                          View Report
                        </Link>
                        <form action={async () => {
                          "use server";
                          await runVerification(claim.claim_id);
                        }}>
                          <button type="submit" className="text-blue-600 hover:text-blue-900">Re-run</button>
                        </form>
                      </div>
                    ) : (
                      <form action={async () => {
                        "use server";
                        await runVerification(claim.claim_id);
                      }}>
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Run Verification</button>
                      </form>
                    )}
                  </td>
                </tr>
              )
            })}
            {claims.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No claims found. Create a draft claim to verify.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
