import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Lightbulb } from "lucide-react";

export default async function VerificationDetail({ params }: { params: { id: string } }) {
  const run = await prisma.verificationRun.findUnique({
    where: { run_id: params.id },
    include: {
      claim: true,
      evidence_items: true,
    }
  });

  if (!run) return notFound();

  const hasConflicts = run.verdict_tier !== 'no_strong_conflict_found';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 shadow rounded-lg border-l-4 border-blue-500 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{run.claim.proposed_term}</h2>
          <p className="text-gray-500 mt-1">Verification Run ID: {run.run_id}</p>
        </div>
        {hasConflicts && (
          <Link href={`/claims/${run.claim_id}/suggestions`} className="bg-amber-100 text-amber-900 px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-amber-200 transition">
            <Lightbulb size={20} />
            <span>Improve with Suggestions</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Verdict</h3>
          <p className="text-2xl font-bold capitalize text-gray-800">{run.verdict_tier?.replace(/_/g, ' ')}</p>
          <p className="mt-4 text-gray-600"><strong>Confidence:</strong> {run.confidence_score ? (run.confidence_score * 100).toFixed(0) + '%' : 'N/A'}</p>
          <p className="mt-2 text-gray-700">{run.summary_reasons}</p>
        </div>

        <div className={`p-6 shadow rounded-lg border border-yellow-200 ${run.verdict_tier === 'no_strong_conflict_found' ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Internal Notes</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{run.limitations_note}</p>
        </div>
      </div>

      <div className="bg-white p-6 shadow rounded-lg">
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Evidence Found</h3>
        {run.evidence_items.length === 0 ? (
          <p className="text-gray-500">No conflicts found in the checked sources.</p>
        ) : (
          <ul className="space-y-4">
            {run.evidence_items.map(item => (
              <li key={item.evidence_id} className="border p-4 rounded-md bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
                      {item.classification} Match
                    </span>
                    <p className="mt-2 font-medium text-gray-900">{item.matched_text_snippet}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.source_label}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 block">Relevance</span>
                    <span className="font-semibold">{(item.relevance_score * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
