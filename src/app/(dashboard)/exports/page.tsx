import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Download, FileJson, Archive } from "lucide-react";

export default async function ExportsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const claims = await prisma.coinedTermClaim.findMany({ 
    where: { user_id: user?.id, publication_state: 'published' },
    include: { verification_runs: { where: { status: 'completed' }, take: 1, include: { evidence_items: true } } }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-lg border-b-4 border-gray-900">
        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight flex items-center gap-3">
          <Archive size={36} /> Provenance Exports
        </h1>
        <p className="text-gray-500">Download machine-readable evidence packets for your published claims.</p>
      </div>

      <div className="grid gap-6">
        {claims.map((claim) => {
          const run = claim.verification_runs[0];
          const packet = {
            id: claim.claim_id,
            term: claim.proposed_term,
            meaning: claim.intended_meaning,
            recorded_at: claim.createdAt,
            verdict: run?.verdict_tier,
            confidence: run?.confidence_score,
            evidence: run?.evidence_items.map(e => ({
              source: e.source_label,
              type: e.classification,
              snippet: e.matched_text_snippet
            }))
          };

          return (
            <div key={claim.claim_id} className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{claim.proposed_term}</h3>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Published {new Date(claim.createdAt).toLocaleDateString()}</p>
              </div>
              <a 
                href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(packet, null, 2))}`}
                download={`orignym-provenance-${claim.normalized_term}.json`}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center gap-2 shadow-lg"
              >
                <FileJson size={20} /> Export JSON
              </a>
            </div>
          );
        })}

        {claims.length === 0 && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
            <Download className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-400 font-bold">No published claims available for export.</p>
            <p className="text-sm text-gray-400">Verify and publish a claim to generate a provenance packet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
