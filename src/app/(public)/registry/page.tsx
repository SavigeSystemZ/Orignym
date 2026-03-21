import prisma from "@/lib/prisma";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";

export default async function RegistryIndex({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q?.toLowerCase() || "";

  const claims = await prisma.coinedTermClaim.findMany({
    where: {
      publication_state: 'published',
      visibility_state: 'public',
      is_frozen: false,
      OR: [
        { normalized_term: { contains: query } },
        { domain_category: { contains: query } },
        { intended_meaning: { contains: query } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div className="space-y-8">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">Public Registry</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Discover timestamped, evidence-backed coined terms and their provenance records.
        </p>
        
        <form action="/registry" method="GET" className="w-full max-w-2xl relative">
          <input 
            type="text" 
            name="q" 
            defaultValue={query}
            placeholder="Search for terms, domains, or meanings..." 
            className="w-full p-6 pl-16 rounded-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white focus:outline-none text-xl transition shadow-inner"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={28} />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {claims.map((claim) => (
          <Link 
            key={claim.claim_id} 
            href={`/registry/${claim.claim_id}`}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition border border-gray-100 group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{claim.domain_category}</span>
                <span className="text-xs text-gray-400">Published {new Date(claim.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition">{claim.proposed_term}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{claim.intended_meaning}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Evidence Backed</span>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}

        {claims.length === 0 && (
          <div className="col-span-full py-24 text-center">
            <p className="text-2xl font-bold text-gray-400">No matching published terms found.</p>
            <Link href="/registry" className="text-blue-600 font-bold hover:underline mt-4 inline-block">Clear Search</Link>
          </div>
        )}
      </div>
    </div>
  );
}
