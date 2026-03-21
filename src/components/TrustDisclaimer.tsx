export default function TrustDisclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="text-xs text-gray-500 italic">
        Orignym provides a provenance record and evidence-backed checks. 
        It does not grant legal ownership or trademark clearance.
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
      <h4 className="text-sm font-bold text-amber-900 mb-1">Important Legal Notice</h4>
      <p className="text-xs text-amber-800 leading-relaxed">
        Orignym is a public platform for recording coined-word provenance and performing evidence-backed conflict scans. 
        <strong> A recorded claim on Orignym does NOT grant legal ownership, exclusive rights, or trademark validity. </strong>
        Verification results represent a &quot;point-in-time&quot; check of available sources and do not guarantee originality or global uniqueness.
        Users are responsible for their own legal due diligence.
      </p>
    </div>
  );
}
