import { createClaim } from "@/lib/actions/claims";
import ClaimForm from "@/components/ClaimForm";
import { Sparkles } from "lucide-react";

export default function NewClaimPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
          <Sparkles size={14} /> Claim Registry
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-foreground">
          Coined Word <span className="text-primary">Provenance</span>
        </h1>
        <p className="text-muted-foreground font-medium max-w-xl mx-auto">
          Start the verification process by providing the core details of your linguistic creation.
        </p>
      </div>

      <ClaimForm action={createClaim} />
    </div>
  );
}
