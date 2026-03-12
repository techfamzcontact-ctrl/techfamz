import HeroSection from "@/components/sections/HeroSection";
import TrustedBySection from "@/components/sections/TrustedBySection";
import ShiftSection from "@/components/sections/ShiftSection";
import MissionSection from "@/components/sections/MissionSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrustedBySection />
      <ShiftSection />
      <MissionSection />

      {/* ═══ TID Teaser ═══ */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-cta)" }}>
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent-blue opacity-[0.04] blur-[120px] pointer-events-none" />
        <div className="divider" />
        <div className="relative py-20 px-5 md:py-[100px] md:px-6 max-w-[700px] mx-auto text-center">
          <div className="reveal">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
              The Techfamz Identity
            </span>
            <h2 className="mb-4">
              One Identity. Verified. Recognized.
            </h2>
            <p className="max-w-[580px] mx-auto text-text-secondary mb-8">
              Introducing <strong className="text-text-primary">TID</strong> — a unique developer identity
              that establishes credibility, enables talent discovery, and connects you with opportunities.
            </p>

            {/* Mini TID badge */}
            <div className="tid-badge mx-auto mb-8 justify-center flex">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="1" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 16c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              TID-DEV-0001
            </div>

            <a
              href="/identity"
              className="inline-flex items-center justify-center gap-2 py-3 px-7 text-[0.95rem] font-semibold text-text-primary bg-transparent border border-border-glass rounded-lg transition-all duration-400 ease-premium hover:-translate-y-0.5 hover:border-accent-blue hover:shadow-[0_0_20px_var(--color-accent-blue-glow-soft)]"
            >
              Learn More About TID
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
