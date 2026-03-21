"use client";

import { useState } from "react";
import { submitReportAction } from "@/lib/actions/report";
import { AlertTriangle, X } from "lucide-react";

export default function ReportModal({ claimId, term }: { claimId: string, term: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition text-sm"
      >
        <AlertTriangle size={18} />
        Report this Entry
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-red-600 p-6 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle size={24} /> Report Entry
          </h3>
          <button onClick={() => setIsOpen(false)}><X size={24} /></button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Report Submitted</h4>
            <p className="text-gray-600">Thank you. Our moderators will review the entry for &quot;{term}&quot;.</p>
            <button 
              onClick={() => setIsOpen(false)}
              className="mt-6 bg-gray-900 text-white px-6 py-2 rounded-full font-bold"
            >
              Close
            </button>
          </div>
        ) : (
          <form action={async (formData) => {
            await submitReportAction(claimId, formData);
            setSubmitted(true);
          }} className="p-6 space-y-4">
            <p className="text-sm text-gray-600 italic">
              Use this form to report entries that violate Orignym terms, are abusive, or clearly infringe on prior use.
            </p>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Reason for Report</label>
              <textarea 
                required 
                name="reason" 
                rows={4} 
                placeholder="Please describe why this entry should be reviewed..."
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-red-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Email (Optional)</label>
              <input 
                type="email" 
                name="email" 
                placeholder="For moderator follow-up"
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-red-500 focus:outline-none transition"
              />
            </div>
            <div className="pt-4 flex gap-3">
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
