"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles, Search, ArrowRight, Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-emerald-600/10 blur-[100px]" />
      </div>

      {/* Top Navigation Bar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-black/10 border-b border-white/5"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">Orignym</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="/registry" className="hover:text-white transition-colors">Registry</Link>
          <Link href="/claims" className="hover:text-white transition-colors">Claims</Link>
          <Link href="/verification" className="hover:text-white transition-colors">Verification</Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5" asChild>
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-lg shadow-primary/20" asChild>
            <Link href="/claims/new">Get Started</Link>
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 pt-20">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80">World Class Coined-Word Provenance</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]"
        >
          The Registry of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
            Original Language.
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
        >
          Anchor your creations. Verify uniqueness with state-of-the-art AI. 
          The decentralized home for every term ever coined.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col md:flex-row gap-4 w-full max-w-md"
        >
          <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl bg-white text-black hover:bg-slate-200 transition-all group shadow-2xl" asChild>
            <Link href="/claims/new">
              Claim Your Term
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-2xl border-white/10 bg-white/5 text-white backdrop-blur-md hover:bg-white/10 transition-all shadow-xl" asChild>
            <Link href="/registry">
              <Search className="mr-2 w-5 h-5" />
              Explore Registry
            </Link>
          </Button>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full"
        >
          {[
            { 
              icon: <Shield className="w-10 h-10 text-blue-400" />, 
              title: "Verified Integrity", 
              desc: "AI-driven consensus to prove term novelty and origin." 
            },
            { 
              icon: <Sparkles className="w-10 h-10 text-purple-400" />, 
              title: "Suggestion Engine", 
              desc: "Intelligent alternatives generated when collisions occur." 
            },
            { 
              icon: <Search className="w-10 h-10 text-emerald-400" />, 
              title: "Public Registry", 
              desc: "Open access to the history of human linguistic innovation." 
            }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 text-left group hover:scale-[1.02] transition-all">
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-40 w-full border-t border-white/5 py-12 px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-slate-500 text-sm">
        <div className="flex items-center gap-2 opacity-50">
          <Shield className="w-4 h-4" />
          <span>© 2026 Orignym / SavigeSystemZ</span>
        </div>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Contact</Link>
        </div>
        <div className="flex gap-4">
          <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
        </div>
      </footer>
    </div>
  );
}
