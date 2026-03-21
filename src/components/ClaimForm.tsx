"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import type { CoinedTermClaim } from "@prisma/client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? "Saving..." : "Save Claim"}
    </button>
  );
}

export default function ClaimForm({ action, initialData }: { action: (formData: FormData) => void, initialData?: Partial<CoinedTermClaim> | null }) {
  return (
    <form action={action} className="bg-white p-6 rounded-lg shadow space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Term</label>
          <input required type="text" name="proposed_term" defaultValue={initialData?.proposed_term} className="w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pronunciation Hint</label>
          <input type="text" name="pronunciation_hint" defaultValue={initialData?.pronunciation_hint || ""} className="w-full border border-gray-300 rounded-md p-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language / Locale</label>
          <input required type="text" name="language_locale" defaultValue={initialData?.language_locale || "en-US"} className="w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Domain / Category</label>
          <input required type="text" name="domain_category" defaultValue={initialData?.domain_category} className="w-full border border-gray-300 rounded-md p-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Intended Meaning</label>
        <textarea required name="intended_meaning" defaultValue={initialData?.intended_meaning} rows={3} className="w-full border border-gray-300 rounded-md p-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description & Use Context</label>
        <textarea required name="description_use_context" defaultValue={initialData?.description_use_context} rows={3} className="w-full border border-gray-300 rounded-md p-2" />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Link href="/claims" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</Link>
        <SubmitButton />
      </div>
    </form>
  );
}
