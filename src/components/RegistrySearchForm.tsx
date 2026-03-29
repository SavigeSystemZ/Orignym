"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RegistrySearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    
    startTransition(() => {
      router.push(`/registry?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl relative group">
      <div className="absolute inset-0 bg-primary/20 blur-[40px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative">
        <Input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for terms, domains, or linguistic meanings..." 
          className="w-full h-20 pl-16 pr-32 rounded-3xl glass-input text-xl font-medium border-border/50 bg-background/40 backdrop-blur-2xl transition-all duration-500 focus:h-22 focus:shadow-2xl"
        />
        <Search className={cn(
          "absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300",
          isPending ? "text-primary animate-pulse" : "text-muted-foreground group-focus-within:text-primary"
        )} size={28} />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => { setQuery(""); router.push("/registry"); }}
              className="rounded-full hover:bg-background/50"
            >
              <X size={20} />
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isPending}
            className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            {isPending ? "Searching..." : "Explore"}
          </Button>
        </div>
      </div>
    </form>
  );
}
