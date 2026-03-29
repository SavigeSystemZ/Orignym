"use client";

import { acceptSuggestionAction, rejectSuggestionAction, rateSuggestionAction } from "@/lib/actions/suggestions";
import { Check, X, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import type { SuggestedAlternative } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SuggestionsList({ claimId, suggestions }: { claimId: string, suggestions: SuggestedAlternative[] }) {
  if (suggestions.length === 0) {
    return (
      <div className="glass-card p-24 text-center border-dashed bg-accent/5">
        <Sparkles className="mx-auto text-muted-foreground/30 mb-6" size={64} />
        <h4 className="text-2xl font-black text-foreground mb-2 tracking-tight uppercase">No Alternatives Yet</h4>
        <p className="text-muted-foreground font-medium max-w-sm mx-auto">
          Generate AI suggestions above to discover linguistically unique variants of your term.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="text-primary" size={24} />
        <h3 className="text-2xl font-black tracking-tight uppercase">AI Generation Results</h3>
        <Badge variant="outline" className="rounded-full px-4 py-1 text-xs font-bold text-muted-foreground ml-auto">
          {suggestions.length} Options
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((suggestion) => {
          const isAccepted = suggestion.state === 'accepted';
          const isRejected = suggestion.state === 'rejected';

          return (
            <Card 
              key={suggestion.id} 
              className={cn(
                "glass-card border-none transition-all duration-300 relative overflow-hidden group",
                isAccepted ? "bg-emerald-500/10 border-emerald-500/20" : 
                isRejected ? "opacity-50 grayscale" : "bg-accent/5 hover:bg-accent/10"
              )}
            >
              {isAccepted && (
                <div className="absolute top-0 right-0 p-4">
                  <Badge className="bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px]">
                    Selected Term
                  </Badge>
                </div>
              )}

              <CardContent className="p-8 space-y-6">
                <div>
                  <h4 className="text-3xl font-black text-foreground tracking-tighter mb-2 group-hover:text-primary transition-colors">
                    {suggestion.term}
                  </h4>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    {suggestion.reason}
                  </p>
                </div>

                <div className="pt-6 border-t border-border/50 flex justify-between items-center">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Match Score: <span className="text-primary text-sm">{(suggestion.ranking_score * 100).toFixed(0)}%</span>
                  </div>
                  
                  {suggestion.state === 'suggested' && (
                    <div className="flex items-center gap-2">
                      <div className="flex bg-background/50 rounded-xl p-1 border border-border/50 mr-4">
                        <form action={rateSuggestionAction.bind(null, suggestion.id, 5)}>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:text-emerald-500 hover:bg-emerald-500/10" title="Like">
                            <ThumbsUp size={14} />
                          </Button>
                        </form>
                        <form action={rateSuggestionAction.bind(null, suggestion.id, 1)}>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:text-red-500 hover:bg-red-500/10" title="Dislike">
                            <ThumbsDown size={14} />
                          </Button>
                        </form>
                      </div>

                      <form action={rejectSuggestionAction.bind(null, suggestion.id)}>
                        <Button type="submit" variant="outline" size="icon" className="rounded-xl border-border/50 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20" title="Dismiss">
                          <X size={18} />
                        </Button>
                      </form>
                      <form action={acceptSuggestionAction.bind(null, claimId, suggestion.id)}>
                        <Button type="submit" className="rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 gap-2">
                          <Check size={18} /> Adopt
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
