import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const features = [
  "Establish technical credibility",
  "Enable structured talent discovery",
  "Connect developers directly with companies",
  "Unlock ecosystem privileges & job referrals",
];

export default function TIDSection() {
  return (
    <section
      id="tid"
      className="relative overflow-hidden py-24 px-5 md:px-6"
      style={{ background: "var(--gradient-section-alt)" }}
    >
      {/* Background Glow */}
      <div
        className="bg-glow bg-accent-blue opacity-10 blur-3xl animate-pulse-glow absolute rounded-full w-[500px] h-[500px] top-[20%] left-1/2 -translate-x-1/2 z-0 pointer-events-none"
      />

      <div className="relative py-12 max-w-[1200px] mx-auto text-center">
        <div className="animate-fade-in-up-delay-1">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft shadow-xs">
            The Techfamz Identity
          </span>
          <h2 className="mb-4 text-[clamp(2.2rem,4.5vw,3.2rem)] font-black tracking-tight">
            One Identity. <span className="text-gradient-blue">Verified & Permanent.</span>
          </h2>
          <p className="max-w-[680px] text-base md:text-lg text-text-secondary mx-auto mb-12 leading-relaxed">
            Introducing <strong className="text-text-primary">TID</strong> — the Techfamz Identity Number. A cryptographically unique developer passport within Africa&apos;s fastest-growing technology network.
          </p>
        </div>

        {/* Holographic TID Card Preview */}
        <div
          className="animate-fade-in-up-delay-2 max-w-[540px] mx-auto mb-12 p-8 md:p-10 bg-bg-card border border-accent-blue/30 rounded-3xl relative overflow-hidden shadow-xl backdrop-blur-md"
        >
          {/* Inner glow */}
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none"
          />

          <p className="text-xs font-mono uppercase tracking-[0.25em] text-text-muted mb-4 relative font-semibold">
            Universal Developer Passport
          </p>

          <div className="tid-badge mx-auto mb-6 justify-center flex shadow-md">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="1" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 16c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>TID-DEV-0001</span>
          </div>

          <p className="text-sm text-text-secondary relative m-0 leading-relaxed">
            Your verified, unique, and permanent identity recognized across top technology companies.
          </p>
        </div>

        {/* Features Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[800px] mx-auto mb-12"
        >
          {features.map((feat, i) => (
            <div
              key={i}
              className="bg-bg-card/80 border border-border-glass rounded-2xl p-5 text-left flex items-center gap-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-blue/40 shadow-xs"
            >
              <div
                className="w-2.5 h-2.5 rounded-full bg-accent-blue shrink-0 shadow-[0_0_8px_var(--color-accent-blue-glow)]"
              />
              <span className="text-sm font-medium text-text-primary">{feat}</span>
            </div>
          ))}
        </div>

        <div className="animate-slide-up-2 flex flex-col items-center gap-4">
          <p className="text-text-muted text-sm max-w-md">
            TID is more than a number. It is an immutable credential built to advance your career.
          </p>
          <Button asChild variant="cta" size="lg" className="rounded-xl px-8 font-bold shadow-lg shadow-amber-500/20">
            <Link href="/identity/claim" className="flex items-center gap-2">
              <Sparkles size={16} />
              Claim Your Developer TID Free
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
