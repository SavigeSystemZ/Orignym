import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import SuggestionsList from "@/components/SuggestionsList";
import { generateSuggestionsAction } from "@/lib/actions/suggestions";
import { RefreshCw, SlidersHorizontal, ArrowLeft, Wand2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SuggestionsPage({ params }: { params: { id: string } }) {
  const claim = await prisma.coinedTermClaim.findUnique({
    where: { claim_id: params.id },
    include: {
      suggested_alternatives: {
        where: { state: { in: ['suggested', 'accepted'] } },
        orderBy: { ranking_score: 'desc' }
      }
    }
  });

  if (!claim) return notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <Link href={`/claims/${claim.claim_id}`}>
          <Button variant="ghost" className="gap-2 font-bold text-muted-foreground hover:text-foreground rounded-xl px-4">
            <ArrowLeft size={18} /> Back to Claim
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-black uppercase tracking-widest">
              <Wand2 size={12} /> AI Innovation Engine
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground">
              {claim.proposed_term}
            </h1>
            <p className="text-muted-foreground font-medium text-lg">
              Resolving conflicts through advanced linguistic synthesis.
            </p>
          </div>

          <SuggestionsList claimId={claim.claim_id} suggestions={claim.suggested_alternatives} />
        </div>

        <aside className="glass-card p-8 bg-accent/5 self-start sticky top-24 border-none space-y-8">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <SlidersHorizontal size={20} className="text-primary" />
            <h3 className="font-black uppercase tracking-widest text-sm">Personalisation</h3>
          </div>

          <form action={generateSuggestionsAction.bind(null, claim.claim_id)} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="tone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Linguistic Tone</Label>
              <select name="tone" id="tone" className="w-full h-12 rounded-xl glass-input px-4 text-sm font-bold bg-background/50 border-border/50 focus:ring-primary/50">
                <option value="creative and professional">Creative & Professional</option>
                <option value="scientific and precise">Scientific & Precise</option>
                <option value="playful and memorable">Playful & Memorable</option>
                <option value="aggressive and dominant">Bold & Modern</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="diversity" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Structural Approach</Label>
              <select name="diversity" id="diversity" className="w-full h-12 rounded-xl glass-input px-4 text-sm font-bold bg-background/50 border-border/50 focus:ring-primary/50">
                <option value="general">General Synthesis</option>
                <option value="Latin-inspired">Latin/Greek Roots</option>
                <option value="Portmanteau">Portmanteau (Blended)</option>
                <option value="Abstract">Abstract/Invented</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="maxLength" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Max Length</Label>
              <Input 
                id="maxLength"
                type="number" 
                name="maxLength" 
                defaultValue={15} 
                min={4}
                max={30}
                className="rounded-xl glass-input h-12 px-4 text-sm font-bold bg-background/50 border-border/50" 
              />
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-500/20 gap-2 transition-all">
              <RefreshCw size={16} /> Generate Terms
            </Button>
          </form>

          <div className="p-4 rounded-xl bg-background/40 border border-border/50 text-[10px] font-medium text-muted-foreground leading-relaxed">
            The AI considers your intended meaning (&quot;{claim.intended_meaning}&quot;) and avoids previously identified conflicts in the registry.
          </div>
        </aside>
      </div>
    </div>
  );
}
