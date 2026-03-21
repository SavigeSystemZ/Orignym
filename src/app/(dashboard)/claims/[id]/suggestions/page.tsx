import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import SuggestionsList from "@/components/SuggestionsList";
import { generateSuggestionsAction } from "@/lib/actions/suggestions";
import { RefreshCw } from "lucide-react";

export default async function SuggestionsPage({ params }: { params: { id: string } }) {
  const claim = await prisma.coinedTermClaim.findUnique({
    where: { claim_id: params.id },
    include: {
      suggested_alternatives: {
        where: { state: { in: ['suggested', 'accepted'] } },
        orderBy: { ranking_score: 'desc' }
      }
    }
  });

  if (!claim) return notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end bg-white p-8 shadow rounded-lg border-b-4 border-blue-600">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-1">Suggestions for</h2>
          <h1 className="text-4xl font-black text-gray-900">{claim.proposed_term}</h1>
          <p className="mt-2 text-gray-500 max-w-lg">{claim.intended_meaning}</p>
        </div>
        
        <form action={async () => {
          "use server";
          await generateSuggestionsAction(claim.claim_id);
        }}>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-700 transition flex items-center gap-2">
            <RefreshCw size={18} /> Regenerate
          </button>
        </form>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-8">
        <h3 className="text-blue-900 font-bold text-lg mb-2">How Suggestions Work</h3>
        <p className="text-blue-800 text-sm leading-relaxed">
          Orignym&apos;s AI analyzes your intended meaning and domain to propose novel coined terms. 
          It filters out identified conflicts and ranks options by linguistic suitability.
          <strong>Accepting a suggestion will update your claim&apos;s proposed term.</strong>
        </p>
      </div>

      <SuggestionsList claimId={claim.claim_id} suggestions={claim.suggested_alternatives} />
    </div>
  );
}
