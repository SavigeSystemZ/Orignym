import { cn } from "@/lib/utils";
import { Info, ShieldAlert } from "lucide-react";

export default function TrustDisclaimer({ compact = false, className }: { compact?: boolean, className?: string }) {
  if (compact) {
    return (
      <div className={cn("text-[10px] text-muted-foreground/60 italic font-medium leading-tight flex items-center gap-2", className)}>
        <Info size={12} className="text-primary/50" />
        Orignym provides a provenance record and evidence-backed checks. 
        It does not grant legal ownership or trademark clearance.
      </div>
    );
  }

  return (
    <div className={cn("glass-card bg-amber-500/5 border-amber-500/20 p-6 flex gap-4 items-start", className)}>
      <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shadow-inner">
        <ShieldAlert size={24} />
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
          Linguistic Provenance Notice
        </h4>
        <p className="text-sm text-slate-400 leading-relaxed font-medium">
          Orignym is a public platform for recording coined-word provenance and performing evidence-backed conflict scans. 
          <span className="text-foreground"> A recorded claim on Orignym does NOT grant legal ownership, exclusive rights, or trademark validity. </span>
          Verification results represent a &quot;point-in-time&quot; check of available sources and do not guarantee originality or global uniqueness.
        </p>
      </div>
    </div>
  );
}
