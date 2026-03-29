"use client";

import { useState } from "react";
import { submitReportAction } from "@/lib/actions/report";
import { 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  ShieldAlert,
  Info
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportModal({ claimId, term }: { claimId: string, term: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state after a short delay to allow closing animation
      setTimeout(() => setSubmitted(false), 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 font-bold transition-all rounded-xl"
        >
          <AlertTriangle size={18} />
          Report Entry
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[480px] p-0 border-none bg-transparent overflow-hidden shadow-none">
        <div className="glass-card bg-background/80 backdrop-blur-3xl border border-border/50 shadow-2xl relative overflow-hidden">
          {/* Header Accents */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-50" />
          
          <div className="p-8 md:p-10 space-y-8">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-10 space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight uppercase">Report Submitted</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                      Thank you for maintaining registry integrity. Our moderators will review &quot;{term}&quot; shortly.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setIsOpen(false)}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 font-bold shadow-xl"
                  >
                    Close Securely
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-8"
                >
                  <DialogHeader className="text-left space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                        <ShieldAlert size={20} />
                      </div>
                      <Badge variant="outline" className="text-red-500 border-red-500/20 rounded-lg font-black text-[10px] uppercase tracking-widest">
                        Registry Governance
                      </Badge>
                    </div>
                    <DialogTitle className="text-3xl font-black tracking-tighter uppercase pt-2">
                      Report <span className="text-red-500">Conflict</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium pt-1 text-base">
                      Reporting: <span className="text-foreground font-bold">{term}</span>
                    </DialogDescription>
                  </DialogHeader>

                  <form action={async (formData) => {
                    setLoading(true);
                    await submitReportAction(claimId, formData);
                    setLoading(false);
                    setSubmitted(true);
                  }} className="space-y-6">
                    <div className="p-4 rounded-xl bg-accent/5 border border-border/50 flex gap-3">
                      <Info size={18} className="text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        Use this form for violations, abusive content, or evidence of prior use. Community reports are essential for linguistic consensus.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="reason" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reason for Review</Label>
                      <Textarea 
                        id="reason"
                        required 
                        name="reason" 
                        rows={4} 
                        placeholder="Please describe the conflict or violation in detail..."
                        className="rounded-xl glass-input p-4 text-sm font-medium focus:ring-red-500/50"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Email (Optional)</Label>
                      <Input 
                        id="email"
                        type="email" 
                        name="email" 
                        placeholder="For moderator follow-up"
                        className="rounded-xl glass-input h-12 px-4 text-sm font-medium focus:ring-red-500/50"
                      />
                    </div>

                    <div className="pt-4 flex gap-4">
                      <Button 
                        type="button" 
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 h-12 font-bold rounded-xl text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-600/20 active:scale-95 transition-all gap-2"
                      >
                        {loading ? "Processing..." : (
                          <>Submit Report <Send size={14} /></>
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
