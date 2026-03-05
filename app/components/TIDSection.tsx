"use client";

const features = [
  "Establish credibility",
  "Enable structured talent discovery",
  "Connect developers directly with companies",
  "Unlock ecosystem privileges",
];

export default function TIDSection() {
  return (
    <section
      id="tid"
      className="relative bg-[linear-gradient(180deg,#060B18_0%,#0A1428_50%,#060B18_100%)] overflow-hidden"
    >
      {/* Background Glow */}
      <div
        className="bg-glow bg-accent-blue opacity-12 blur-[120px] animate-pulse-glow absolute rounded-full w-[500px] h-[500px] top-[20%] left-1/2 -translate-x-1/2 z-0"
      />

      <div className="relative py-20 px-5 md:py-[120px] md:px-6 max-w-[1200px] mx-auto text-center">
        <div className="reveal">
          <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">The Techfamz Identity</span>
          <h2 className="mb-6">
            One Identity. Verified. Recognized.
          </h2>
          <p className="max-w-[680px] text-lg text-text-secondary mx-auto mb-12">
            Introducing <strong className="text-text-primary">TID</strong> — Techfamz
            Identity Number. A unique developer identity within the Techfamz ecosystem.
          </p>
        </div>

        {/* TID Card */}
        <div
          className="reveal reveal-delay-2 max-w-[560px] mx-auto mb-12 p-12 bg-[linear-gradient(135deg,rgba(12,26,58,0.9),rgba(6,11,24,0.95))] border border-accent-blue rounded-2xl relative overflow-hidden"
        >
          {/* Inner glow */}
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none"
          />

          <p
            className="text-[0.8rem] uppercase tracking-[0.2em] text-text-muted mb-5 relative"
          >
            Developer Identity
          </p>

          <div className="tid-badge mx-auto mb-7 justify-center flex">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="1" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 16c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            TID-DEV-0001
          </div>

          <p className="text-[0.9rem] text-text-muted relative m-0">
            Your verified, unique, and permanent identity in the Techfamz network.
          </p>
        </div>

        {/* Features Grid */}
        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 max-w-[800px] mx-auto mb-12"
        >
          {features.map((feat, i) => (
            <div
              key={i}
              className="bg-bg-card border border-border-glass rounded-lg p-8 backdrop-blur-md transition-all duration-400 ease-premium hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-border-glass-hover stagger-item px-6 py-5 text-left flex flex-row items-center gap-3"
              style={{
                transitionDelay: `${0.3 + i * 0.1}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full bg-accent-blue shrink-0 shadow-[0_0_8px_var(--color-accent-blue-glow)]"
              />
              <span className="text-[0.95rem] text-text-secondary">{feat}</span>
            </div>
          ))}
        </div>

        <div className="reveal reveal-delay-4">
          <p className="text-text-muted mb-2 text-[0.95rem]">
            TID is more than a number. It is a professional identity within a growing technology network.
          </p>
          <p
            className="text-accent-blue-light font-semibold text-[1.05rem] tracking-[0.02em]"
          >
            Developer Portal Launching Soon.
          </p>
        </div>
      </div>
    </section>
  );
}
