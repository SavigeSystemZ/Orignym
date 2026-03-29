"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { CoinedTermClaim } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Info, 
  Globe, 
  Tag, 
  FileText 
} from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 shadow-lg shadow-primary/20 font-bold min-w-[140px]"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Sparkles size={18} />
          </motion.div>
          Analyzing...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Finalize Claim <Check size={18} />
        </span>
      )}
    </Button>
  );
}

const STEPS = [
  { id: "term", title: "The Term", icon: <Tag size={18} /> },
  { id: "context", title: "Meaning", icon: <FileText size={18} /> },
  { id: "details", title: "Classification", icon: <Globe size={18} /> },
];

export default function ClaimForm({ 
  action, 
  initialData 
}: { 
  action: (formData: FormData) => void, 
  initialData?: Partial<CoinedTermClaim> | null 
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-12 px-4">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center gap-2 relative flex-1">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10",
              i <= currentStep 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "bg-accent/50 text-muted-foreground border border-border/50"
            )}>
              {i < currentStep ? <Check size={20} /> : step.icon}
            </div>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
              i <= currentStep ? "text-primary" : "text-muted-foreground/50"
            )}>
              {step.title}
            </span>
            {/* Connector Line */}
            {i < STEPS.length - 1 && (
              <div className="absolute top-5 left-[50%] w-full h-[2px] bg-border/30 -z-0">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: i < currentStep ? 1 : 0 }}
                  className="h-full bg-primary origin-left transition-transform duration-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <form action={action} className="glass-card p-8 md:p-12 relative">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  What is the term?
                </h3>
                <p className="text-muted-foreground font-medium">This is the unique coined word you are anchoring to your identity.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="proposed_term" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Proposed Term</Label>
                  <Input 
                    id="proposed_term"
                    required 
                    type="text" 
                    name="proposed_term" 
                    placeholder="e.g. Orignym"
                    defaultValue={initialData?.proposed_term} 
                    className="h-14 rounded-xl glass-input px-6 text-lg font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pronunciation_hint" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Pronunciation (Optional)</Label>
                  <Input 
                    id="pronunciation_hint"
                    type="text" 
                    name="pronunciation_hint" 
                    placeholder="e.g. O-rij-nim"
                    defaultValue={initialData?.pronunciation_hint || ""} 
                    className="h-14 rounded-xl glass-input px-6 text-lg font-bold" 
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
                <Info className="text-blue-500 shrink-0 mt-1" size={20} />
                <p className="text-sm text-slate-400 leading-relaxed">
                  Our AI will verify the uniqueness of this term across multiple databases including phonetic and semantic overlaps.
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Define the context.</h3>
                <p className="text-muted-foreground font-medium">The meaning and use-case help prove the originality of your claim.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="intended_meaning" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Intended Meaning</Label>
                  <Textarea 
                    id="intended_meaning"
                    required 
                    name="intended_meaning" 
                    placeholder="Describe exactly what this term represents..."
                    defaultValue={initialData?.intended_meaning} 
                    rows={4} 
                    className="rounded-xl glass-input p-6 text-base font-medium min-h-[120px]" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_use_context" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Usage Context</Label>
                  <Textarea 
                    id="description_use_context"
                    required 
                    name="description_use_context" 
                    placeholder="Where will this term be used? (e.g. Branding for a SaaS platform)"
                    defaultValue={initialData?.description_use_context} 
                    rows={4} 
                    className="rounded-xl glass-input p-6 text-base font-medium min-h-[120px]" 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Final details.</h3>
                <p className="text-muted-foreground font-medium">Categorizing your claim ensures proper validation against industry peers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="language_locale" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Language / Locale</Label>
                  <Input 
                    id="language_locale"
                    required 
                    type="text" 
                    name="language_locale" 
                    placeholder="en-US"
                    defaultValue={initialData?.language_locale || "en-US"} 
                    className="h-14 rounded-xl glass-input px-6 text-lg font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain_category" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Domain / Category</Label>
                  <Input 
                    id="domain_category"
                    required 
                    type="text" 
                    name="domain_category" 
                    placeholder="e.g. Technology"
                    defaultValue={initialData?.domain_category} 
                    className="h-14 rounded-xl glass-input px-6 text-lg font-bold" 
                  />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Sparkles size={14} /> Ready for Analysis
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  By submitting this claim, you acknowledge that Orignym is a decentralized registry and does not provide legal trademark advice.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Controls */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/50">
          <div>
            {currentStep > 0 ? (
              <Button 
                type="button"
                variant="ghost" 
                onClick={prevStep}
                className="rounded-xl px-6 h-12 font-bold gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={18} /> Previous
              </Button>
            ) : (
              <Link href="/claims">
                <Button variant="ghost" className="rounded-xl px-6 h-12 font-bold text-muted-foreground hover:text-red-500 transition-colors">
                  Cancel
                </Button>
              </Link>
            )}
          </div>

          <div>
            {currentStep < STEPS.length - 1 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                className="bg-accent hover:bg-accent/80 text-foreground rounded-xl px-8 h-12 shadow-lg font-bold gap-2"
              >
                Next <ArrowRight size={18} />
              </Button>
            ) : (
              <SubmitButton />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
