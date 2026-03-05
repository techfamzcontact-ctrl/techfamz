"use client";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#040810_0%,#060B18_30%,#0C1A3A_60%,#060B18_100%)]"
    >
      {/* ═══ LAYER 1: Deep space fog ═══ */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-15%] w-[700px] h-[700px] rounded-full bg-accent-blue opacity-[0.06] blur-[160px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#1e3a8a] opacity-[0.08] blur-[140px] animate-pulse-glow-navy" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent-blue opacity-[0.04] blur-[120px]" />
      </div>

      {/* ═══ LAYER 2: Subtle grid ═══ */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none">
        <defs>
          <pattern id="heroGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" />
      </svg>

      {/* ═══ LAYER 3: Floating orbital rings ═══ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer ring */}
        <div
          className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full border border-accent-blue opacity-[0.06]"
          style={{ animation: "spin 80s linear infinite" }}
        />
        {/* Middle ring */}
        <div
          className="absolute w-[400px] h-[400px] md:w-[550px] md:h-[550px] rounded-full border border-accent-blue-light opacity-[0.04]"
          style={{ animation: "spin 60s linear infinite reverse" }}
        />
        {/* Inner ring */}
        <div
          className="absolute w-[220px] h-[220px] md:w-[320px] md:h-[320px] rounded-full border border-accent-blue opacity-[0.08]"
          style={{ animation: "spin 40s linear infinite" }}
        />
      </div>

      {/* ═══ LAYER 4: Floating particles ═══ */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {[
          { cx: "12%", cy: "18%", r: 1.5, delay: "0s" },
          { cx: "25%", cy: "72%", r: 2, delay: "1.5s" },
          { cx: "38%", cy: "28%", r: 1, delay: "0.8s" },
          { cx: "52%", cy: "85%", r: 1.5, delay: "2s" },
          { cx: "65%", cy: "15%", r: 2, delay: "0.5s" },
          { cx: "78%", cy: "62%", r: 1, delay: "3s" },
          { cx: "88%", cy: "35%", r: 1.5, delay: "1.2s" },
          { cx: "42%", cy: "55%", r: 1, delay: "2.5s" },
          { cx: "18%", cy: "45%", r: 2, delay: "1.8s" },
          { cx: "72%", cy: "42%", r: 1, delay: "0.3s" },
          { cx: "92%", cy: "78%", r: 1.5, delay: "2.2s" },
          { cx: "8%", cy: "88%", r: 1, delay: "3.5s" },
        ].map((p, i) => (
          <circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            className="fill-accent-blue-light"
            style={{
              animation: `networkPulse 4s ease-in-out infinite`,
              animationDelay: p.delay,
            }}
          />
        ))}
      </svg>

      {/* ═══ LAYER 5: Connector lines ═══ */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]">
        <line x1="12%" y1="18%" x2="38%" y2="28%" className="stroke-accent-blue stroke-[0.5]" />
        <line x1="38%" y1="28%" x2="65%" y2="15%" className="stroke-accent-blue stroke-[0.5]" />
        <line x1="65%" y1="15%" x2="88%" y2="35%" className="stroke-accent-blue stroke-[0.5]" />
        <line x1="25%" y1="72%" x2="52%" y2="85%" className="stroke-accent-blue stroke-[0.5]" />
        <line x1="18%" y1="45%" x2="42%" y2="55%" className="stroke-accent-blue stroke-[0.5]" />
        <line x1="42%" y1="55%" x2="72%" y2="42%" className="stroke-accent-blue stroke-[0.5]" />
        <line x1="72%" y1="42%" x2="78%" y2="62%" className="stroke-accent-blue stroke-[0.5]" />
      </svg>

      {/* ═══ LAYER 6: Top vignette & bottom fade ═══ */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent,#040810_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-[linear-gradient(to_top,#060B18,transparent)] pointer-events-none" />

      {/* ═══ CONTENT ═══ */}
      <div className="relative z-10 text-center max-w-[860px] px-6 py-20">
        {/* Status badge */}
        <div className="animate-fade-in-up-delay-1 mb-8">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent-blue-light border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent-blue-light opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-blue-light" />
            </span>
            Building the Future
          </span>
        </div>

        {/* Main headline */}
        <h1 className="mb-6 animate-fade-in-up-delay-1 text-[clamp(2.2rem,5.5vw,4.2rem)] leading-[1.08] tracking-[-0.03em] font-[800]">
          Engineering the Future
          <br />
          <span className="bg-[linear-gradient(135deg,#60a5fa,#3b82f6,#93c5fd)] bg-clip-text text-transparent">
            of African Technology
          </span>
        </h1>

        {/* Sub headline */}
        <p className="max-w-[620px] mx-auto mb-4 text-text-secondary leading-[1.7] text-[clamp(1rem,2vw,1.15rem)] animate-fade-in-up-delay-2">
          Techfamz is building a structured technology ecosystem designed to unify developers, engineers,
          and forward-thinking companies across Africa and beyond.
        </p>

        {/* Mystery line */}
        <p className="max-w-[520px] mx-auto mb-10 text-text-muted leading-relaxed text-[0.95rem] opacity-0 animate-[fadeInUp_0.7s_cubic-bezier(0.16,1,0.3,1)_0.55s_both]">
          What began as a community is evolving into infrastructure — built for talent, built for
          opportunity, built for scale.
        </p>

        {/* CTA buttons */}
        <div className="flex justify-center gap-4 flex-wrap animate-slide-up-1">
          <a
            href="#join"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 py-[14px] px-8 text-[0.95rem] font-semibold text-bg-primary bg-cta-yellow rounded-lg transition-all duration-400 ease-premium hover:-translate-y-0.5 hover:bg-cta-yellow-hover hover:shadow-[0_0_30px_var(--color-cta-yellow-glow)] after:absolute after:inset-0 after:opacity-0 after:transition-opacity after:duration-400 after:ease-premium hover:after:opacity-100 after:bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.3),transparent_60%)]"
          >
            Claim Your Techfamz Identity
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 ease-premium group-hover:translate-x-0.5">
              <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#shift"
            className="inline-flex items-center justify-center gap-2 py-[14px] px-8 text-[0.95rem] font-semibold text-text-primary bg-transparent border border-border-glass rounded-lg transition-all duration-400 ease-premium hover:-translate-y-0.5 hover:border-accent-blue hover:shadow-[0_0_20px_var(--color-accent-blue-glow-soft)] animate-slide-up-2"
          >
            Explore the Vision
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 opacity-0 animate-[fadeInUp_0.7s_cubic-bezier(0.16,1,0.3,1)_1.2s_both]">
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <span className="text-[0.65rem] uppercase tracking-[0.2em] font-medium">Scroll</span>
            <div className="w-[1px] h-8 bg-[linear-gradient(to_bottom,var(--color-text-muted),transparent)] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Inline keyframe for ring spin */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
