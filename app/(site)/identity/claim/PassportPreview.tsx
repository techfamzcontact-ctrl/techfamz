import { Cpu } from "lucide-react";
import { MAX_SKILLS } from "./claim-data";

/** Live preview of the passport card while the form is filled in (always a dark card, like the real one). */
export function PassportPreview({
  fullName,
  role,
  country,
  skills,
}: {
  fullName: string;
  role: string;
  country: string;
  skills: string[];
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-brand-navy p-6 text-white shadow-lg">
      {/* Card Header */}
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-9 items-center justify-center rounded-md border border-cta-yellow/40 bg-cta-yellow/20">
            <Cpu size={15} className="text-cta-yellow" />
          </div>
          <div>
            <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#60a5fa]">
              Techfamz Developer ID
            </span>
            <span className="font-mono text-[10px] text-white/50">LIVE PREVIEW</span>
          </div>
        </div>
        <span className="rounded-md bg-white/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#93c5fd]">DRAFT</span>
      </div>

      {/* TID Number */}
      <div className="mb-5">
        <span className="block font-mono text-[9px] uppercase tracking-widest text-white/40">
          TID Number · assigned when you claim
        </span>
        <span className="font-mono text-xl font-bold tracking-wider text-[#60a5fa] md:text-2xl">TF•••••••</span>
      </div>

      {/* Name & Role */}
      <div className="mb-5">
        <p className="text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
          {fullName.trim() || "Your Name Here"}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-[#93c5fd]">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
          <span>{role || "Primary role"}</span>
          {country.trim() && (
            <>
              <span className="text-white/30" aria-hidden="true">•</span>
              <span className="uppercase text-white/70">{country.trim()}</span>
            </>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-white/40">
          Skills ({skills.length}/{MAX_SKILLS})
        </span>
        <div className="flex min-h-[28px] flex-wrap gap-1.5">
          {skills.length > 0 ? (
            skills.map((s) => (
              <span key={s} className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white">
                {s}
              </span>
            ))
          ) : (
            <span className="font-mono text-[11px] italic text-white/40">Your skills appear here</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[10px] text-white/50">
        <span>AFRICAN DEVELOPER REGISTRY</span>
        <span className="font-bold text-cta-yellow">TECHFAMZ.COM/TID</span>
      </div>
    </div>
  );
}
