import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { freezeClaimAction, unpublishClaimAction, resolveReportAction } from "@/lib/actions/moderation";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL || session?.user?.email === "admin@orignym.local";

  if (!isAdmin) {
    redirect("/");
  }

  const reports = await prisma.report.findMany({
    where: { status: 'pending' },
    include: { claim: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Shield size={16} /> 
            <span>Moderator Access</span>
          </div>
          <h1 className="text-4xl font-black">Admin Command Center</h1>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Active Session</p>
          <p className="font-mono text-blue-400">{session?.user?.email}</p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <AlertCircle className="text-red-600" /> 
          Pending Reports ({reports.length})
        </h2>

        <div className="grid gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6 flex justify-between items-start border-b border-gray-50 bg-gray-50/50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{report.claim.proposed_term}</h3>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                    ID: {report.claim_id} | Reported by {report.reporter_email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={async () => {
                    "use server";
                    await resolveReportAction(report.id);
                  }}>
                    <button className="bg-green-100 text-green-800 px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-200 transition flex items-center gap-2">
                      <CheckCircle size={16} /> Dismiss
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Report Context</h4>
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-900 text-sm leading-relaxed">
                    {report.reason}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Moderation Actions</h4>
                  <div className="flex gap-3">
                    <form action={async () => {
                      "use server";
                      await freezeClaimAction(report.claim_id);
                      await resolveReportAction(report.id);
                    }} className="flex-1">
                      <button className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-orange-700 transition">
                        Freeze Entry
                      </button>
                    </form>
                    <form action={async () => {
                      "use server";
                      await unpublishClaimAction(report.claim_id);
                      await resolveReportAction(report.id);
                    }} className="flex-1">
                      <button className="w-full bg-red-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-red-700 transition">
                        Unpublish Revert
                      </button>
                    </form>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center uppercase font-bold">
                    All actions are logged to the immutable audit trail
                  </p>
                </div>
              </div>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center">
              <p className="text-gray-400 font-bold">No pending reports. The registry is clean.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
