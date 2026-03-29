import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { 
  FileText, 
  CheckCircle, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  Clock,
  Plus,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardIndex() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      _count: {
        select: {
          claims: true,
        }
      }
    }
  });

  if (!user) return null;

  const stats = [
    { 
      label: "Total Claims", 
      value: user._count.claims, 
      icon: <FileText className="text-blue-500" />, 
      change: "+2 this week",
      color: "blue"
    },
    { 
      label: "Verified Terms", 
      value: await prisma.verificationRun.count({ where: { claim: { user_id: user.id }, status: "completed" } }), 
      icon: <CheckCircle className="text-emerald-500" />, 
      change: "100% accuracy",
      color: "emerald"
    },
    { 
      label: "AI Suggestions", 
      value: await prisma.suggestedAlternative.count({ where: { claim: { user_id: user.id } } }), 
      icon: <Sparkles className="text-purple-500" />, 
      change: "High quality",
      color: "purple"
    },
    { 
      label: "System Health", 
      value: "Optimum", 
      icon: <TrendingUp className="text-blue-400" />, 
      change: "All systems go",
      color: "cyan"
    },
  ];

  const recentClaims = await prisma.coinedTermClaim.findMany({
    where: { user_id: user.id },
    orderBy: { updatedAt: 'desc' },
    take: 5
  });

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground mb-2">
            Welcome back, <span className="text-primary">{session.user.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground font-medium">Here&apos;s what&apos;s happening with your coined terms today.</p>
        </div>
        <Button size="lg" className="rounded-2xl h-14 px-8 shadow-xl shadow-primary/20 gap-2 font-bold" asChild>
          <Link href="/claims/new">
            <Plus size={20} />
            Create New Claim
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="glass-card border-none shadow-none bg-accent/5 hover:bg-accent/10 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className="p-2 rounded-lg bg-background/50 backdrop-blur-sm shadow-sm">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tighter mb-1">{stat.value}</div>
              <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                <ArrowUpRight size={12} className="text-emerald-500" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 glass-card border-none bg-accent/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black tracking-tight">Recent Claims</CardTitle>
              <p className="text-sm text-muted-foreground font-medium">Your latest linguistic innovations.</p>
            </div>
            <Button variant="ghost" className="font-bold gap-2 hover:bg-accent/50 rounded-xl" asChild>
              <Link href="/claims">
                View All <ArrowRight size={16} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClaims.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground font-medium italic">No claims recorded yet.</p>
                </div>
              ) : (
                recentClaims.map((claim) => (
                  <div key={claim.claim_id} className="flex items-center justify-between p-4 rounded-2xl bg-background/40 hover:bg-background/60 border border-border/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase shadow-inner">
                        {claim.proposed_term[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{claim.proposed_term}</h4>
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(claim.updatedAt).toLocaleDateString()} • {claim.domain_category}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full" asChild>
                      <Link href={`/claims/${claim.claim_id}`}>
                        <ArrowRight size={18} />
                      </Link>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* System / AI Insights */}
        <Card className="glass-card border-none bg-primary/5 border-primary/10">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
              <Sparkles className="text-primary w-5 h-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
              <h5 className="text-sm font-black text-primary uppercase tracking-wider mb-2">Pro Tip</h5>
              <p className="text-sm text-foreground leading-relaxed font-medium">
                Try using phonetic variants in your descriptions to help the AI detect near-collisions more accurately.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-muted-foreground">Verification Speed</span>
                <span className="text-emerald-500">Fast</span>
              </div>
              <div className="w-full h-2 bg-accent/20 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
              </div>
              <div className="flex justify-between text-sm font-bold pt-2">
                <span className="text-muted-foreground">Model Efficiency</span>
                <span className="text-blue-500">Tier S</span>
              </div>
              <div className="w-full h-2 bg-accent/20 rounded-full overflow-hidden">
                <div className="w-[92%] h-full bg-blue-500 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
