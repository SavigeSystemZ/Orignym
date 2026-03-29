import { 
  ChevronRight, 
  Globe, 
  Clock, 
  ShieldCheck, 
  BadgeCheck,
  SearchX,
  ShieldAlert,
  ShieldX
} from "lucide-react";
import { RegistrySearchForm } from "@/components/RegistrySearchForm";
import { FilterSidebar } from "@/components/registry/filter-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RegistrySearchService } from "@/lib/search/service";
import Link from "next/link";

export default async function RegistryIndex({ searchParams }: { searchParams: { q?: string, domain?: string, verdictTier?: string } }) {
  const filters = {
    query: searchParams.q?.toLowerCase(),
    domain: searchParams.domain,
    verdictTier: searchParams.verdictTier
  };

  const claims = await RegistrySearchService.search(filters, 50);

  const getVerdictIcon = (tier?: string | null) => {
    if (tier === 'no_strong_conflict_found') return <ShieldCheck size={14} className="text-emerald-500" />;
    if (tier === 'potential_conflict_identified') return <ShieldAlert size={14} className="text-amber-500" />;
    if (tier === 'high_risk_conflict') return <ShieldX size={14} className="text-red-500" />;
    return <ShieldCheck size={14} className="text-muted-foreground" />;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20 px-4 xl:px-0">
      {/* Search Hero */}
      <div className="relative overflow-hidden glass-card p-12 md:p-20 text-center border-none bg-accent/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <Globe size={12} /> Global Coined-Word Database
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
              Public <span className="text-primary">Registry</span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto">
              Verify provenance and explore original linguistic innovations anchored to the decentralized ledger of human creativity.
            </p>
          </div>

          <RegistrySearchForm />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar />
        
        {/* Results Section */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <BadgeCheck className="text-primary" size={24} /> 
              Certified Records
            </h2>
            <Badge variant="outline" className="rounded-full px-4 py-1 text-xs font-bold text-muted-foreground border-border/50">
              {claims.length} Records Found
            </Badge>
          </div>

          {claims.length === 0 ? (
            <div className="glass-card p-24 text-center border-dashed bg-accent/5">
              <SearchX className="mx-auto text-muted-foreground/30 mb-6" size={64} />
              <h4 className="text-2xl font-black text-foreground mb-2 tracking-tight uppercase">No matching terms</h4>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-8">
                We couldn&apos;t find any published terms matching your criteria. Try adjusting your filters.
              </p>
              <Link href="/registry">
                <Button variant="outline" className="rounded-xl font-bold gap-2">
                  Clear Filters
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {claims.map((claim) => {
                const latestRun = claim.verification_runs?.[0];
                return (
                  <Link 
                    key={claim.claim_id} 
                    href={`/registry/${claim.claim_id}`}
                    className="group relative flex flex-col justify-between"
                  >
                    <div className="absolute -inset-2 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                    <div className="relative flex-1 glass-card p-8 bg-background/40 hover:bg-background/60 border-border/50 transition-all duration-300 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <Badge variant="secondary" className="rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border-primary/20">
                          {claim.domain_category}
                        </Badge>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50 flex items-center gap-1">
                          <Clock size={10} /> {new Date(claim.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <h3 className="text-3xl font-black text-foreground tracking-tight mb-3 group-hover:text-primary transition-colors">
                        {claim.proposed_term}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground font-medium line-clamp-3 mb-8 flex-1 leading-relaxed">
                        {claim.intended_meaning}
                      </p>
                      
                      <div className="pt-6 border-t border-border/50 flex justify-between items-center mt-auto">
                        <div className="flex items-center gap-2">
                          {getVerdictIcon(latestRun?.verdict_tier)}
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            {latestRun ? "Evidence Backed" : "Unverified"}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-accent/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
