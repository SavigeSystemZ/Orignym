import TrustDisclaimer from "@/components/TrustDisclaimer";
import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b h-16 flex items-center px-8 justify-between">
        <Link href="/" className="text-2xl font-black text-gray-900 tracking-tight">Orignym</Link>
        <nav className="flex items-center gap-6">
          <Link href="/registry" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Registry</Link>
          <Link href="/api/auth/signin" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-700 transition">Sign In</Link>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-8">
        {children}
      </main>

      <footer className="bg-white border-t p-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Orignym Public Registry</h3>
            <p className="text-sm text-gray-600 max-w-sm">
              The global timestamped record of coined terms, provenance, and evidence-backed checks.
            </p>
          </div>
          <TrustDisclaimer />
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Orignym. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
