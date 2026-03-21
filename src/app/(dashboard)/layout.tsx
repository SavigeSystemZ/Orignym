import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, FileText, CheckCircle, Database, Download, Shield } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL || session?.user?.email === "admin@orignym.local";

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Orignym</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/claims" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <FileText size={20} />
            <span>Draft Claims</span>
          </Link>
          <Link href="/verification" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <CheckCircle size={20} />
            <span>Verification</span>
          </Link>
          <Link href="/registry" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <Database size={20} />
            <span>Registry</span>
          </Link>
          <Link href="/exports" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
            <Download size={20} />
            <span>Exports</span>
          </Link>
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-blue-700 font-bold rounded-md hover:bg-blue-50">
              <Shield size={20} />
              <span>Admin Center</span>
            </Link>
          )}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {session.user?.name?.[0] || 'U'}
            </div>
            <div className="text-sm font-medium text-gray-900 truncate">
              {session.user?.email}
            </div>
          </div>
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2 text-red-600 rounded-md hover:bg-red-50">
            <LogOut size={20} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
