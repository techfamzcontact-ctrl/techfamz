import HeroSection from "@/components/sections/HeroSection";
import TrustedBySection from "@/components/sections/TrustedBySection";
import ShiftSection from "@/components/sections/ShiftSection";
import MissionSection from "@/components/sections/MissionSection";
import CTASection from "@/components/sections/CTASection";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrustedBySection />
      <ShiftSection />
      <MissionSection />

      {/* ═══ TID Teaser ═══ */}
      <section className="relative overflow-hidden py-24 px-5 md:px-6" style={{ background: "var(--gradient-cta)" }}>
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-blue opacity-[0.06] blur-3xl pointer-events-none" />
        <div className="divider mb-16" />
        <div className="relative max-w-[760px] mx-auto text-center">
          <div className="animate-fade-in-up-delay-1">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft shadow-xs">
              The Techfamz Identity
            </span>
            <h2 className="mb-4 text-[clamp(2.2rem,4.5vw,3.5rem)] font-black tracking-tight">
              One Identity. <span className="text-gradient-blue">Verified & Recognized.</span>
            </h2>
            <p className="max-w-[600px] mx-auto text-text-secondary text-base md:text-lg mb-8 leading-relaxed">
              Introducing <strong className="text-text-primary">TID</strong> — your permanent developer passport that establishes technical credibility, enables discovery, and unlocks curated opportunities.
            </p>

            {/* Mini TID badge with holographic glow */}
            <div className="tid-badge mx-auto mb-10 justify-center flex shadow-lg hover:scale-105 transition-transform duration-300 cursor-default">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="1" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 16c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>TID-DEV-0001</span>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/identity/claim"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-8 text-sm font-bold text-bg-primary bg-cta-yellow rounded-xl transition-all duration-300 hover:bg-cta-yellow-hover hover:-translate-y-0.5 shadow-lg shadow-amber-500/20"
              >
                <Sparkles size={16} />
                Claim Your TID Free
              </Link>
              <Link
                href="/identity"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-7 text-sm font-semibold text-text-primary bg-bg-card/70 border border-border-glass rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-blue"
              >
                Learn More
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
