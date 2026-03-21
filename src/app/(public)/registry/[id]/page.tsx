import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import TrustDisclaimer from "@/components/TrustDisclaimer";
import ReportModal from "@/components/ReportModal";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default async function PublicClaimDetail({ params }: { params: { id: string } }) {
  const claim = await prisma.coinedTermClaim.findFirst({
    where: { 
      claim_id: params.id,
      publication_state: 'published',
      visibility_state: 'public',
      is_frozen: false
    },
    include: {
      verification_runs: {
        where: { status: 'completed' },
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          evidence_items: true
        }
      }
    }
  });

  if (!claim) return notFound();

  const latestRun = claim.verification_runs[0];
  const lowConflict = latestRun?.verdict_tier === 'no_strong_conflict_found';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded">REGISTRY RECORD</span>
          <span>{claim.domain_category}</span>
        </div>
        <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">{claim.proposed_term}</h1>
        <p className="text-2xl text-gray-600 leading-relaxed max-w-2xl mb-8">
          &ldquo;{claim.intended_meaning}&rdquo;
        </p>

        <div className={`px-6 py-3 rounded-full flex items-center gap-2 font-bold transition ${lowConflict ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
          {lowConflict ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <span>{latestRun?.verdict_tier?.replace(/_/g, ' ').toUpperCase() || 'VERIFICATION PENDING'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-50">
          <h3 className="text-lg font-black text-gray-900 border-b pb-4 mb-4 uppercase tracking-widest">Provenance Info</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Normalized Form</dt>
              <dd className="text-xl font-mono text-gray-900">{claim.normalized_term}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">First Recorded</dt>
              <dd className="text-xl font-medium text-gray-900">{new Date(claim.createdAt).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Publication State</dt>
              <dd className="text-xl font-medium text-gray-900 capitalize">{claim.publication_state}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-50 h-full">
            <h3 className="text-lg font-black text-gray-900 border-b pb-4 mb-4 uppercase tracking-widest">Evidence Summary</h3>
            {latestRun ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">{latestRun.summary_reasons}</p>
                <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest mt-4">
                  <span>Confidence: {((latestRun.confidence_score || 0) * 100).toFixed(0)}%</span>
                  <span>{latestRun.evidence_items.length} signals detected</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No verification record found for this public entry.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-black text-gray-900 mb-1 uppercase tracking-widest">Community Governance</h3>
          <p className="text-sm text-gray-500">Notice something wrong? Help us maintain the integrity of the registry.</p>
        </div>
        <ReportModal claimId={claim.claim_id} term={claim.proposed_term} />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-50">
        <h3 className="text-lg font-black text-gray-900 border-b pb-4 mb-4 uppercase tracking-widest">Legal Notice & Limitations</h3>
        <TrustDisclaimer />
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 leading-relaxed italic border border-gray-100">
          <strong>LATEST VERIFICATION LIMITATIONS:</strong> {latestRun?.limitations_note || 'N/A'}
        </div>
      </div>
    </div>
  );
}
