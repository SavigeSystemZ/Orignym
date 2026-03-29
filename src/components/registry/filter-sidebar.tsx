"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Filter, Layers, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const DOMAINS = ["Technology", "Healthcare", "Finance", "Entertainment", "Science", "Arts"];
const VERDICTS = [
  { id: "no_strong_conflict_found", label: "Clear (Pristine)" },
  { id: "potential_conflict_identified", label: "Potential Conflict" },
  { id: "high_risk_conflict", label: "High Risk" },
];

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentDomain = searchParams.get("domain");
  const currentVerdict = searchParams.get("verdictTier");

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (params.get(key) === value) {
      params.delete(key); // Toggle off
    } else {
      params.set(key, value);
    }
    
    startTransition(() => {
      router.push(`/registry?${params.toString()}`);
    });
  };

  return (
    <aside className="w-full md:w-64 space-y-8 glass-card p-6 bg-accent/5 self-start sticky top-24">
      <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
        <Filter size={18} className="text-primary" />
        <h3 className="font-black uppercase tracking-widest text-sm">Filters</h3>
        {isPending && <Sparkles size={14} className="text-primary animate-spin ml-auto" />}
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <Layers size={12} /> Domain Context
        </h4>
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => updateFilter("domain", domain)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                currentDomain === domain 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "bg-background/50 hover:bg-primary/10 text-muted-foreground hover:text-primary border border-border/50"
              )}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-border/50">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <ShieldAlert size={12} /> Verification Tier
        </h4>
        <div className="flex flex-col gap-2">
          {VERDICTS.map((verdict) => (
            <button
              key={verdict.id}
              onClick={() => updateFilter("verdictTier", verdict.id)}
              className={cn(
                "text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between",
                currentVerdict === verdict.id 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "hover:bg-accent text-muted-foreground border border-transparent"
              )}
            >
              {verdict.label}
              {currentVerdict === verdict.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
