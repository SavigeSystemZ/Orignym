import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  ArrowLeft, 
  Search, 
  Sparkles,
  ExternalLink,
  Target,
  FileBadge,
  Globe,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TrustDisclaimer from "@/components/TrustDisclaimer";
import { cn } from "@/lib/utils";

export default async function VerificationDetail({ params }: { params: { id: string } }) {
  const run = await prisma.verificationRun.findUnique({
    where: { run_id: params.id },
    include: {
      claim: true,
      evidence_items: true,
    }
  });

  if (!run) return notFound();

  const isClear = run.verdict_tier === 'no_strong_conflict_found';
  const hasConflicts = run.verdict_tier !== 'no_strong_conflict_found';

  const getVerdictIcon = () => {
    if (isClear) return <ShieldCheck className="text-emerald-500" size={32} />;
    if (run.verdict_tier === 'potential_conflict_identified') return <ShieldAlert className="text-amber-500" size={32} />;
    return <ShieldX className="text-red-500" size={32} />;
  };

  const getVerdictColor = () => {
    if (isClear) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (run.verdict_tier === 'potential_conflict_identified') return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <Link href={`/claims/${run.claim_id}`}>
          <Button variant="ghost" className="gap-2 font-bold text-muted-foreground hover:text-foreground rounded-xl px-4">
            <ArrowLeft size={18} /> Back to Claim
          </Button>
        </Link>
        <div className="flex gap-3">
          <Badge variant="outline" className="rounded-lg px-3 py-1 font-black uppercase tracking-widest text-[10px] opacity-50">
            Run ID: {run.run_id.split('-')[0]}
          </Badge>
          <Badge variant="outline" className="rounded-lg px-3 py-1 font-black uppercase tracking-widest text-[10px] opacity-50">
            Model: {run.model_used || 'Gemini-1.5-Pro'}
          </Badge>
        </div>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <Search size={12} /> Verification Consensus
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-foreground">
            {run.claim.proposed_term}
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-xl">
            Linguistic analysis across global databases, phonetics, and semantic contexts.
          </p>
        </div>
        {hasConflicts && (
          <Link href={`/claims/${run.claim_id}/suggestions`}>
            <Button size="lg" className="rounded-2xl h-14 px-8 bg-amber-500 hover:bg-amber-600 text-white shadow-xl shadow-amber-500/20 gap-3 font-bold">
              <Sparkles size={20} />
              Improve Term
            </Button>
          </Link>
        )}
      </div>

      {/* Verdict Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 glass-card border-none overflow-visible relative">
          <div className="absolute -top-4 -left-4">
            <div className={cn("p-4 rounded-2xl shadow-2xl backdrop-blur-3xl border", getVerdictColor())}>
              {getVerdictIcon()}
            </div>
          </div>
          <CardHeader className="pt-12">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Final Verdict</CardTitle>
                <div className={cn("text-3xl font-black tracking-tighter uppercase", isClear ? "text-emerald-500" : "text-foreground")}>
                  {run.verdict_tier?.replace(/_/g, ' ')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Confidence</div>
                <div className="text-3xl font-black tracking-tighter text-primary">
                  {run.confidence_score ? (run.confidence_score * 100).toFixed(0) + '%' : 'N/A'}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="p-6 rounded-2xl bg-accent/5 border border-border/50">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <FileBadge size={14} className="text-primary" /> Analysis Summary
              </h4>
              <p className="text-lg font-medium leading-relaxed text-foreground/90 italic italic-quoted">
                &quot;{run.summary_reasons}&quot;
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background/40 border border-border/50">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Primary Source</div>
                <div className="font-bold flex items-center gap-2">
                  <Globe size={14} className="text-blue-500" /> Web/Corpuses
                </div>
              </div>
              <div className="p-4 rounded-xl bg-background/40 border border-border/50">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Scan Depth</div>
                <div className="font-bold flex items-center gap-2">
                  <Target size={14} className="text-purple-500" /> Comprehensive
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glass-card border-none bg-accent/5">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-slate-400 leading-relaxed">
                {run.limitations_note}
              </p>
            </CardContent>
          </Card>
          
          <TrustDisclaimer compact />
        </div>
      </div>

      {/* Evidence Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <Database className="text-primary" size={24} /> 
            Conflict Evidence
          </h3>
          <div className="h-px flex-1 bg-border/50" />
          <Badge variant="outline" className="rounded-full px-4 py-1 text-xs font-bold text-muted-foreground">
            {run.evidence_items.length} Points Found
          </Badge>
        </div>

        {run.evidence_items.length === 0 ? (
          <div className="glass-card p-12 text-center border-dashed bg-emerald-500/5 border-emerald-500/20">
            <ShieldCheck className="mx-auto text-emerald-500 mb-4" size={48} />
            <h4 className="text-xl font-black text-foreground mb-2">Pristine Uniqueness</h4>
            <p className="text-muted-foreground font-medium">No significant conflicts were identified in any public linguistic databases.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {run.evidence_items.map((item) => (
              <div key={item.evidence_id} className="glass-card p-6 bg-accent/5 hover:bg-accent/10 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <Badge className={cn(
                    "rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest",
                    item.classification === 'exact' ? "bg-red-500 text-white" : "bg-primary/20 text-primary"
                  )}>
                    {item.classification} Match
                  </Badge>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Relevance</div>
                    <div className="text-lg font-black text-primary italic">
                      {(item.relevance_score * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                
                <p className="text-xl font-bold text-foreground mb-4 leading-snug group-hover:text-primary transition-colors">
                  {item.matched_text_snippet}
                </p>
                
                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <Globe size={12} className="text-blue-500" /> {item.source_label}
                  </div>
                  {item.source_url_identifier && (
                    <Link href={item.source_url_identifier} target="_blank" className="text-primary hover:underline flex items-center gap-1 text-xs font-black uppercase">
                      Source <ExternalLink size={12} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TrustDisclaimer className="mt-12" />
    </div>
  );
}
