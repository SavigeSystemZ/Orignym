import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import TrustDisclaimer from "@/components/TrustDisclaimer";
import ReportModal from "@/components/ReportModal";
import { CommentThread } from "@/components/registry/CommentThread";
import { 
  ShieldCheck, 
  Globe, 
  Clock, 
  Fingerprint, 
  Award,
  Search,
  FileText,
  BadgeCheck,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
      },
      comments: {
        where: { is_flagged: false },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!claim) return notFound();

  const latestRun = claim.verification_runs[0];
  const isClear = latestRun?.verdict_tier === 'no_strong_conflict_found';

  // Increment profile views
  await prisma.claimAnalytics.upsert({
    where: { claim_id: claim.claim_id },
    create: { claim_id: claim.claim_id, profile_views: 1, last_viewed_at: new Date() },
    update: { profile_views: { increment: 1 }, last_viewed_at: new Date() }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 px-4 md:px-0">
      {/* Official Certificate Hero */}
      <div className="relative overflow-hidden glass-card p-12 md:p-20 text-center border-2 border-primary/20 shadow-2xl">
        {/* Background Embellishments */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500 blur-[100px]" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-background/50 border border-border/50 backdrop-blur-md shadow-sm">
            <BadgeCheck className="text-primary" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/70">Registry of Original Language</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-7xl md:text-9xl font-black tracking-[calc(-0.05em)] text-foreground leading-none">
              {claim.proposed_term}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </div>

          <p className="text-2xl md:text-3xl font-medium text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            &ldquo;{claim.intended_meaning}&rdquo;
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
            <div className={cn(
              "px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-sm tracking-widest border transition-all shadow-xl",
              isClear 
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
            )}>
              {isClear ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
              <span>{latestRun?.verdict_tier?.replace(/_/g, ' ').toUpperCase() || 'VERIFICATION PENDING'}</span>
            </div>
            
            <div className="flex items-center gap-4 text-muted-foreground/50">
              <Award size={48} className="opacity-20" />
              <div className="text-left border-l border-border/50 pl-4 uppercase">
                <p className="text-[10px] font-black tracking-widest">Certificate ID</p>
                <p className="text-xs font-bold text-foreground font-mono">{claim.claim_id.split('-')[0].toUpperCase()}-{Date.now().toString().slice(-4)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Provenance Metadata */}
        <Card className="glass-card border-none bg-accent/5">
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <Fingerprint className="text-primary" size={20} />
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Metadata</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Normalized Hash</p>
                <p className="text-lg font-mono text-foreground truncate">{claim.normalized_term}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Origin Date</p>
                <p className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  {new Date(claim.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Domain Context</p>
                <Badge variant="secondary" className="rounded-lg px-3 py-1 font-bold">
                  {claim.domain_category}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Evidence */}
        <Card className="md:col-span-2 glass-card border-none bg-primary/5">
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search className="text-primary" size={20} />
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Linguistic Evidence</h3>
              </div>
              <Badge className="bg-primary text-white px-3 py-1 rounded-lg font-black text-[10px]">
                {((latestRun?.confidence_score || 0) * 100).toFixed(0)}% CONFIDENCE
              </Badge>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-background/40 border border-border/50">
                <p className="text-lg font-medium leading-relaxed italic text-foreground/80">
                  &quot;{latestRun?.summary_reasons || "Primary scan complete. Analysis suggests a unique linguistic footprint with minimal overlap in current checked corpuses."}&quot;
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-accent/5 border border-border/50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Scope</p>
                    <p className="text-sm font-bold">Global Linguistic Corpuses</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-accent/5 border border-border/50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Matches</p>
                    <p className="text-sm font-bold">{latestRun?.evidence_items.length || 0} External Signals</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CommentThread claimId={claim.claim_id} initialComments={claim.comments} />

      {/* Community & Integrity */}
      <div className="glass-card p-8 border-none bg-accent/5 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-tight uppercase">Registry Integrity</h3>
          <p className="text-muted-foreground font-medium max-w-lg">
            Notice a conflict or an existing prior use? Orignym relies on community governance to maintain high-fidelity records.
          </p>
        </div>
        <ReportModal claimId={claim.claim_id} term={claim.proposed_term} />
      </div>

      {/* Legal & Footer */}
      <div className="space-y-8">
        <TrustDisclaimer className="shadow-none border-none" />
        <div className="p-6 rounded-2xl bg-accent/5 border border-border/50 text-sm text-slate-400 italic font-medium leading-relaxed">
          <span className="font-black text-foreground not-italic uppercase tracking-widest text-[10px] block mb-2 opacity-50">Latest Analysis Notes</span>
          &quot;{latestRun?.limitations_note || 'This record is provided as-is without guarantee of novelty beyond the scope of the verified linguistic datasets.'}&quot;
        </div>
      </div>
    </div>
  );
}
