import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  Send, 
  BarChart3,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock publish action since it might be missing or named differently
async function publishClaim(id: string) {
  "use server";
  // Logic moved to a proper action file in reality
  await prisma.coinedTermClaim.update({
    where: { claim_id: id },
    data: { publication_state: 'published', visibility_state: 'public' }
  });
}

export default async function ClaimDetail({ params }: { params: { id: string } }) {
  const claim = await prisma.coinedTermClaim.findUnique({
    where: { claim_id: params.id },
    include: {
      verification_runs: {
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      analytics: true
    }
  });

  if (!claim) return notFound();

  const isPublished = claim.publication_state === 'published';
  const latestRun = claim.verification_runs[0];
  const canPublish = latestRun && latestRun.status === 'completed';
  const analytics = claim.analytics;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link href="/claims">
          <Button variant="ghost" className="gap-2 font-bold text-muted-foreground hover:text-foreground rounded-xl px-4">
            <ArrowLeft size={18} /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex gap-3">
          <Link href={`/claims/${claim.claim_id}/edit`}>
            <Button variant="outline" className="rounded-xl font-bold gap-2 border-border/50 bg-background/50 backdrop-blur-md">
              <Edit size={16} /> Edit Draft
            </Button>
          </Link>
          {isPublished && (
            <Link href={`/registry/${claim.claim_id}`} target="_blank">
              <Button variant="outline" className="rounded-xl font-bold gap-2 border-primary/20 bg-primary/5 text-primary">
                <Eye size={16} /> View Public Record
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Hero Control Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className={cn(
              "rounded-lg px-3 py-1 font-black uppercase tracking-widest text-[10px]",
              isPublished ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
            )}>
              {claim.publication_state}
            </Badge>
            <Badge variant="outline" className="rounded-lg px-3 py-1 font-black uppercase tracking-widest text-[10px] opacity-50 border-border/50">
              {claim.visibility_state}
            </Badge>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-foreground">
            {claim.proposed_term}
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-xl">
            &ldquo;{claim.intended_meaning}&rdquo;
          </p>
        </div>

        {!isPublished && (
          <form action={publishClaim.bind(null, claim.claim_id)}>
            <Button 
              size="lg" 
              disabled={!canPublish}
              className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 gap-3 font-bold"
            >
              <Send size={20} />
              Publish to Registry
            </Button>
            {!canPublish && (
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-2 text-center">
                Run verification first
              </p>
            )}
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Core Details */}
        <Card className="glass-card border-none bg-accent/5">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Term Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Normalization</p>
              <p className="text-lg font-mono font-bold">{claim.normalized_term}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Pronunciation</p>
              <p className="text-lg font-bold">{claim.pronunciation_hint || "None provided"}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Domain</p>
              <Badge variant="secondary" className="rounded-lg font-bold">{claim.domain_category}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Verification Hub */}
        <Card className="md:col-span-2 glass-card border-none bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Verification Hub</CardTitle>
            {latestRun && (
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-lg">
                Latest: {latestRun.verdict_tier?.replace(/_/g, ' ')}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {claim.verification_runs.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                  <ShieldCheck size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-xl tracking-tight">Ready for Scan?</h4>
                  <p className="text-muted-foreground text-sm font-medium">Verify your term to unlock public registry features.</p>
                </div>
                <Link href={`/verification`}>
                  <Button className="rounded-xl font-bold gap-2">
                    Start Verification <Sparkles size={16} />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {claim.verification_runs.map((run) => (
                  <Link key={run.run_id} href={`/verification/${run.run_id}`}>
                    <div className="group flex items-center justify-between p-4 rounded-2xl bg-background/40 hover:bg-background/60 border border-border/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shadow-inner",
                          run.verdict_tier === 'no_strong_conflict_found' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                        )}>
                          {run.verdict_tier === 'no_strong_conflict_found' ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
                        </div>
                        <div>
                          <h5 className="font-bold text-sm uppercase tracking-tight group-hover:text-primary transition-colors">
                            {run.verdict_tier?.replace(/_/g, ' ')}
                          </h5>
                          <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">
                            {new Date(run.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div className="hidden sm:block">
                          <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Confidence</p>
                          <p className="text-sm font-black text-primary">{(run.confidence_score! * 100).toFixed(0)}%</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <ArrowLeft className="rotate-180" size={16} />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Suggestion & Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card border-none bg-accent/5">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-inner">
              <Sparkles size={28} />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-black tracking-tight uppercase">AI Alternatives</h4>
              <p className="text-sm text-muted-foreground font-medium mb-4">Generate 4+ high-quality alternatives based on your current conflicts.</p>
              <Link href={`/claims/${claim.claim_id}/suggestions`}>
                <Button size="sm" variant="secondary" className="rounded-lg font-bold gap-2">
                  View Suggestions <ArrowLeft className="rotate-180" size={14} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none bg-accent/5">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="text-blue-500" size={20} />
              <h4 className="text-lg font-black tracking-tight uppercase">Search Insights</h4>
            </div>
            
            {!isPublished ? (
              <div className="p-4 border border-dashed border-border/50 rounded-xl text-center">
                <Activity className="mx-auto text-muted-foreground/30 mb-2" size={24} />
                <p className="text-xs font-medium text-muted-foreground">Publish term to track analytics.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background/40 border border-border/50 text-center">
                  <div className="text-3xl font-black text-foreground mb-1">{analytics?.profile_views || 0}</div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-1">
                    <Eye size={10} /> Profile Views
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-background/40 border border-border/50 text-center">
                  <div className="text-3xl font-black text-foreground mb-1">{analytics?.search_impressions || 0}</div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-1">
                    <TrendingUp size={10} /> Search Impressions
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
