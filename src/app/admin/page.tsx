import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  freezeClaimAction, 
  unpublishClaimAction, 
  resolveReportAction 
} from "@/lib/actions/moderation";
import { 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  User, 
  Calendar,
  Zap,
  Activity,
  Gavel,
  Lock,
  RotateCcw
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL || session?.user?.email === "admin@orignym.local";

  if (!isAdmin) {
    redirect("/");
  }

  const reports = await prisma.report.findMany({
    where: { status: 'pending' },
    include: { claim: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Admin Command Hero */}
      <div className="relative overflow-hidden glass-card p-10 md:p-12 border-none bg-slate-900 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest">
              <Shield size={12} /> Restricted Command Center
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none">
              Registry <span className="text-blue-400">Moderation</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-md">
              Maintain the integrity of linguistic provenance through active community governance.
            </p>
          </div>
          
          <div className="glass-card bg-white/5 border-white/10 p-6 min-w-[240px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                {session?.user?.name?.[0] || 'A'}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Active Session</p>
                <p className="text-sm font-bold text-blue-400 truncate max-w-[150px]">{session?.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-emerald-500">
              <Activity size={12} /> System Operational
            </div>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-4 md:px-0">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <AlertCircle className="text-red-500" size={28} /> 
              Pending Queue
            </h2>
            <Badge variant="destructive" className="rounded-full px-4 py-1 text-xs font-black tracking-widest animate-pulse">
              {reports.length} ALERTS
            </Badge>
          </div>
          <div className="h-px flex-1 bg-border/50 mx-8 hidden md:block" />
        </div>

        <div className="grid gap-8">
          {reports.map((report) => (
            <Card key={report.id} className="glass-card border-none bg-accent/5 overflow-hidden group transition-all duration-300">
              <div className="p-8 space-y-8">
                {/* Report Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-3xl font-black tracking-tighter text-foreground">
                        {report.claim.proposed_term}
                      </h3>
                      <Badge variant="outline" className="rounded-lg font-black text-[10px] uppercase tracking-widest opacity-50">
                        {report.claim_id.split('-')[0]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <span className="flex items-center gap-1.5"><User size={12} className="text-primary" /> Reporter: {report.reporter_email || "Anonymous"}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> Received: {new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <form action={async () => {
                    "use server";
                    await resolveReportAction(report.id);
                  }}>
                    <Button variant="outline" className="rounded-xl font-bold gap-2 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20 transition-all px-6 border-border/50">
                      <CheckCircle size={18} /> Dismiss Report
                    </Button>
                  </form>
                </div>

                <Separator className="bg-border/50" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Context Panel */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 flex items-center gap-2">
                      <Zap size={12} className="text-amber-500" /> Alleged Violation
                    </h4>
                    <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 relative">
                      <p className="text-lg font-medium leading-relaxed text-red-900/80 dark:text-red-200/80 italic">
                        &quot;{report.reason}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Actions Panel */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 flex items-center gap-2">
                      <Gavel size={12} className="text-blue-500" /> Executive Verdict
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <form action={async () => {
                        "use server";
                        await freezeClaimAction(report.claim_id);
                        await resolveReportAction(report.id);
                      }}>
                        <Button className="w-full h-16 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-600/20 gap-3">
                          <Lock size={18} /> Freeze Entry
                        </Button>
                      </form>
                      <form action={async () => {
                        "use server";
                        await unpublishClaimAction(report.claim_id);
                        await resolveReportAction(report.id);
                      }}>
                        <Button className="w-full h-16 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-red-600/20 gap-3">
                          <RotateCcw size={18} /> Unpublish Revert
                        </Button>
                      </form>
                    </div>
                    
                    <p className="text-[10px] font-black text-center text-muted-foreground/40 uppercase tracking-widest px-8">
                      Authorized actions are logged to the immutable audit trail for governance transparency.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {reports.length === 0 && (
            <div className="glass-card p-24 text-center border-dashed bg-accent/5 border-border/50">
              <Shield className="mx-auto text-muted-foreground/20 mb-6" size={64} />
              <h4 className="text-2xl font-black text-foreground mb-2 tracking-tight uppercase">Registry Clean</h4>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                All community reports have been processed. No pending violations in the queue.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
