import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/claims");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <main className="text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">Welcome to Orignym</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A public platform for coined-word recording, provenance, validation, and registry search.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/api/auth/signin" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition">
            Sign In / Register
          </Link>
        </div>
        <p className="mt-12 text-sm text-gray-500">
          Note: Orignym does not grant legal ownership of words. It is an evidence-backed registry.
        </p>
      </main>
    </div>
  );
}
