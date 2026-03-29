import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Code2, Key, TerminalSquare, AlertTriangle, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateApiKeyAction } from "@/lib/actions/team";
import { Badge } from "@/components/ui/badge";

export default async function DevelopersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/api/auth/signin");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      memberships: {
        include: { 
          organization: {
            include: { api_keys: true }
          } 
        }
      }
    }
  });

  const activeOrg = user?.memberships[0]?.organization;

  if (!activeOrg) {
    redirect("/team");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-inner">
            <TerminalSquare size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground">Developers & API</h1>
            <p className="text-muted-foreground font-medium">Manage API keys for {activeOrg.name}</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl font-bold">
          <Code2 size={16} /> Read Docs
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card border-none bg-accent/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-black tracking-tight">Active API Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-3 text-sm text-amber-600/80 dark:text-amber-400 font-medium">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <p>Keys provide full access to your organization&apos;s claims and registry data. Do not share them in public repositories.</p>
            </div>

            <div className="space-y-4">
              {activeOrg.api_keys.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border/50 rounded-xl">
                  <Key className="mx-auto text-muted-foreground/30 mb-4" size={32} />
                  <p className="text-muted-foreground font-medium">No API keys generated yet.</p>
                </div>
              ) : (
                activeOrg.api_keys.map(key => (
                  <div key={key.id} className="p-5 rounded-xl bg-background/40 border border-border/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-foreground">{key.name}</span>
                        <Badge variant="outline" className="text-[10px] font-black uppercase">Live</Badge>
                      </div>
                      <code className="text-xs text-muted-foreground font-mono bg-accent/50 px-2 py-1 rounded">
                        {key.key.substring(0, 12)}...{key.key.substring(key.key.length - 4)}
                      </code>
                      <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest font-bold">
                        Created: {new Date(key.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none bg-purple-500/5 border-purple-500/10 self-start">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-purple-500">Generate New Key</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={generateApiKeyAction.bind(null, activeOrg.id)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Key Identifier</label>
                <Input name="name" required placeholder="e.g. Production Server" className="h-12 glass-input bg-background/50 border-purple-500/20 focus:ring-purple-500/50 font-bold text-sm" />
              </div>
              <Button className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-purple-500/20 rounded-xl gap-2 transition-all">
                <Key size={14} /> Create Secret Key
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
