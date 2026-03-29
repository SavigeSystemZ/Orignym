import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL || session?.user?.email === "admin@orignym.local";

  return (
    <div className="flex h-screen bg-background selection:bg-primary/20">
      {/* Background Decorative Blurs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <Sidebar user={session.user} isAdmin={isAdmin} />
      
      <main className="flex-1 relative overflow-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
