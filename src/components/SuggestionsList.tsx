"use client";

import { acceptSuggestionAction, rejectSuggestionAction } from "@/lib/actions/suggestions";
import { Check, X, ThumbsUp } from "lucide-react";
import type { SuggestedAlternative } from "@prisma/client";

export default function SuggestionsList({ claimId, suggestions }: { claimId: string, suggestions: SuggestedAlternative[] }) {
  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => (
        <div key={suggestion.id} className={`p-6 bg-white shadow rounded-lg border-l-4 ${suggestion.state === 'accepted' ? 'border-green-500' : 'border-blue-400'}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-bold text-gray-900">{suggestion.term}</h4>
                {suggestion.state === 'accepted' && (
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ThumbsUp size={12} /> Accepted
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-2">{suggestion.reason}</p>
              <div className="mt-2 text-xs text-gray-400">
                AI Match Score: {(suggestion.ranking_score * 100).toFixed(0)}%
              </div>
            </div>
            
            {suggestion.state === 'suggested' && (
              <div className="flex gap-2">
                <form action={async () => {
                  await rejectSuggestionAction(suggestion.id);
                }}>
                  <button type="submit" title="Reject" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition">
                    <X size={20} />
                  </button>
                </form>
                <form action={async () => {
                  await acceptSuggestionAction(claimId, suggestion.id);
                }}>
                  <button type="submit" title="Accept" className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition">
                    <Check size={20} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {suggestions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-dashed border-gray-300">
          <p className="text-gray-500">No suggestions generated yet.</p>
        </div>
      )}
    </div>
  );
}
