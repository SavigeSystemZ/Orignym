import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Plus, Shield, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOrganizationAction } from "@/lib/actions/team";

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/api/auth/signin");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: { organization: true }
      }
    }
  });

  const activeOrg = user?.memberships[0]?.organization;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex items-center gap-4 border-b border-border/50 pb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Workspace Settings</h1>
          <p className="text-muted-foreground font-medium">Manage your team, organization, and billing details.</p>
        </div>
      </div>

      {!activeOrg ? (
        <Card className="glass-card border-none bg-accent/5 max-w-lg mx-auto mt-20">
          <CardHeader className="text-center pb-2">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
            <CardTitle className="text-2xl font-black">Create a Workspace</CardTitle>
            <p className="text-muted-foreground text-sm font-medium">You need an organization to collaborate or use APIs.</p>
          </CardHeader>
          <CardContent>
            <form action={createOrganizationAction} className="space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Organization Name</label>
                <Input name="name" required placeholder="e.g. Acme Corp" className="h-12 glass-input font-bold" />
              </div>
              <Button className="w-full h-12 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                Create Organization
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 glass-card border-none bg-accent/5">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6">
              <div>
                <CardTitle className="text-2xl font-black text-foreground">{activeOrg.name}</CardTitle>
                <p className="text-xs text-muted-foreground font-medium mt-1 font-mono">{activeOrg.slug}</p>
              </div>
              <Button variant="outline" className="gap-2 rounded-xl border-border/50">
                <Settings size={16} /> Manage
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Team Members</h3>
                <Button size="sm" className="gap-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary">
                  <Plus size={14} /> Invite
                </Button>
              </div>
              
              <div className="space-y-4">
                {user?.memberships.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-background/40 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {user.name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {m.role}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-none bg-primary/5">
             <CardContent className="p-8 space-y-6">
               <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                 <Shield size={16} /> Plan & Quotas
               </h3>
               <div>
                 <p className="text-3xl font-black">Free Tier</p>
                 <p className="text-sm text-muted-foreground font-medium mt-1">Upgrade to increase API limits.</p>
               </div>
               <Button className="w-full rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90">
                 Upgrade Plan
               </Button>
             </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
