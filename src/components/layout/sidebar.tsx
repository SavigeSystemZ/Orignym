"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LogOut, 
  FileText, 
  CheckCircle, 
  Database, 
  Download, 
  Shield, 
  LayoutDashboard,
  PlusCircle,
  Menu,
  X,
  Users,
  TerminalSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  isAdmin: boolean;
}

export function Sidebar({ user, isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Draft Claims", href: "/claims", icon: FileText },
    { name: "New Claim", href: "/claims/new", icon: PlusCircle },
    { name: "Verification", href: "/verification", icon: CheckCircle },
    { name: "Registry", href: "/registry", icon: Database },
    { name: "Team Settings", href: "/team", icon: Users },
    { name: "Developers", href: "/developers", icon: TerminalSquare },
    { name: "Exports", href: "/exports", icon: Download },
  ];

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden text-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      <motion.aside 
        initial={false}
        animate={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-background/60 backdrop-blur-2xl border-r border-border/50 flex flex-col overflow-hidden md:relative",
          !isOpen && "md:hidden"
        )}
      >
        <div className="h-20 flex items-center px-8 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground uppercase">Orignym</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <item.icon size={20} className={cn(isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}

          {isAdmin && (
            <div className="pt-8">
              <p className="px-4 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Administration</p>
              <Link href="/admin">
                <motion.div
                  whileHover={{ x: 4 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                    pathname === "/admin" 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                      : "text-blue-600/70 hover:text-blue-600 hover:bg-blue-500/10"
                  )}
                >
                  <Shield size={20} />
                  <span>Admin Center</span>
                </motion.div>
              </Link>
            </div>
          )}
        </nav>

        <div className="p-6 mt-auto border-t border-border/50 bg-accent/5">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 text-white flex items-center justify-center font-bold shadow-inner">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 overflow-hidden text-sm font-bold">
              <p className="text-foreground truncate">{user?.name || 'User'}</p>
              <p className="text-muted-foreground text-xs font-medium truncate">{user?.email}</p>
            </div>
            <ModeToggle />
          </div>
          <Link href="/api/auth/signout">
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold">
              <LogOut size={20} />
              <span>Sign Out</span>
            </Button>
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
