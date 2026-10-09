import HeroSection from "@/components/sections/HeroSection";
import ShiftSection from "@/components/sections/ShiftSection";
import MissionSection from "@/components/sections/MissionSection";
import CTASection from "@/components/sections/CTASection";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ShiftSection />
      <MissionSection />

      {/* ═══ TID Teaser ═══ */}
      <section className="bg-bg-secondary py-20 md:py-28">
        <div className="max-w-[1140px] mx-auto px-5 md:px-8 grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <span className="eyebrow">
              The Techfamz Identity
            </span>
            <h2 className="mb-4 text-[clamp(2.2rem,4.5vw,3.5rem)] font-extrabold tracking-[-0.03em]">
              One Identity. <span className="text-accent-blue-light">Verified & Recognized.</span>
            </h2>
            <p className="max-w-[600px] text-text-secondary text-base md:text-lg mb-8 leading-relaxed">
              Introducing <strong className="text-text-primary">TID</strong> — your permanent developer passport that establishes technical credibility, enables discovery, and unlocks curated opportunities.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/identity/claim"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-semibold text-on-cta bg-cta-yellow rounded-lg transition-colors duration-150 hover:bg-cta-yellow-hover"
              >
                Claim Your TID Free
              </Link>
              <Link
                href="/identity"
                className="group inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-semibold text-text-primary border border-border-glass rounded-lg transition-colors duration-150 hover:border-border-glass-hover hover:bg-text-primary/5"
              >
                Learn More
                <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Sample TID badge */}
          <div className="flex md:justify-end">
            <div className="tid-badge md:text-2xl md:py-5 md:px-8">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 16c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>TID-DEV-0001</span>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
