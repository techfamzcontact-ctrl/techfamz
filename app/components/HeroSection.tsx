"use client";

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(180deg, #060B18 0%, #0C1A3A 50%, #060B18 100%)",
      }}
    >
      <div
        className="bg-glow bg-accent-blue opacity-12 blur-[120px] animate-pulse-glow"
        style={{ width: 600, height: 600, top: "-10%", right: "-10%", position: "absolute", borderRadius: "50%", zIndex: 0 }}
      />
      <div
        className="bg-glow bg-[#1e3a8a] opacity-15 blur-[120px] animate-pulse-glow-navy"
        style={{ width: 500, height: 500, bottom: "0%", left: "-5%", position: "absolute", borderRadius: "50%", zIndex: 0 }}
      />

      {/* Animated Grid Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Floating Network Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <line x1="10%" y1="20%" x2="30%" y2="35%" className="stroke-accent-blue stroke-1 opacity-20 animate-network-pulse" />
        <line x1="30%" y1="35%" x2="55%" y2="20%" className="stroke-accent-blue stroke-1 opacity-20 animate-network-pulse" style={{ animationDelay: "1s" }} />
        <line x1="55%" y1="20%" x2="80%" y2="40%" className="stroke-accent-blue stroke-1 opacity-20 animate-network-pulse" style={{ animationDelay: "2s" }} />
        <line x1="80%" y1="40%" x2="90%" y2="70%" className="stroke-accent-blue stroke-1 opacity-20 animate-network-pulse" style={{ animationDelay: "0.5s" }} />
        <line x1="20%" y1="70%" x2="45%" y2="80%" className="stroke-accent-blue stroke-1 opacity-20 animate-network-pulse" style={{ animationDelay: "1.5s" }} />
        <line x1="45%" y1="80%" x2="70%" y2="65%" className="stroke-accent-blue stroke-1 opacity-20 animate-network-pulse" style={{ animationDelay: "3s" }} />

        <circle cx="10%" cy="20%" r="3" className="fill-accent-blue-light animate-network-pulse" />
        <circle cx="30%" cy="35%" r="4" className="fill-accent-blue-light animate-network-pulse" style={{ animationDelay: "1s" }} />
        <circle cx="55%" cy="20%" r="3" className="fill-accent-blue-light animate-network-pulse" style={{ animationDelay: "2s" }} />
        <circle cx="80%" cy="40%" r="5" className="fill-accent-blue-light animate-network-pulse" style={{ animationDelay: "0.5s" }} />
        <circle cx="90%" cy="70%" r="3" className="fill-accent-blue-light animate-network-pulse" style={{ animationDelay: "1.5s" }} />
        <circle cx="20%" cy="70%" r="4" className="fill-accent-blue-light animate-network-pulse" style={{ animationDelay: "3s" }} />
        <circle cx="45%" cy="80%" r="3" className="fill-accent-blue-light animate-network-pulse" style={{ animationDelay: "2.5s" }} />
        <circle cx="70%" cy="65%" r="4" className="fill-accent-blue-light animate-network-pulse" style={{ animationDelay: "1.2s" }} />
      </svg>

      {/* Content */}
      <div className="relative z-10 text-center max-w-[800px] px-6">
        <h1 className="mb-6 animate-fade-in-up-delay-1">
          Engineering the Future of African Technology
        </h1>

        <p className="max-w-[640px] mx-auto mb-4 text-text-secondary leading-relaxed text-[clamp(1rem,2vw,1.25rem)] animate-fade-in-up-delay-2">
          Techfamz is building a structured technology ecosystem designed to unify developers, engineers,
          and forward-thinking companies across Africa and beyond.
        </p>

        <p
          className="max-w-[580px] mx-auto mb-10 text-text-muted leading-relaxed text-base opacity-0 animate-[fadeInUp_0.7s_cubic-bezier(0.16,1,0.3,1)_0.55s_both]"
        >
          What began as a community is evolving into infrastructure — built for talent, built for
          opportunity, built for scale.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="#join"
            className="relative overflow-hidden inline-flex items-center justify-center gap-2 py-4 px-8 text-base font-semibold text-bg-primary bg-cta-yellow rounded-md transition-all duration-400 ease-premium hover:-translate-y-0.5 hover:bg-cta-yellow-hover hover:shadow-[0_0_30px_var(--color-cta-yellow-glow)] after:absolute after:inset-0 after:opacity-0 after:transition-opacity after:duration-400 after:ease-premium hover:after:opacity-100 after:bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.3),transparent_60%)] animate-slide-up-1"
          >
            Claim Your Techfamz Identity
          </a>
          <a
            href="#shift"
            className="inline-flex items-center justify-center gap-2 py-4 px-8 text-base font-semibold text-text-primary bg-transparent border border-border-glass rounded-md transition-all duration-400 ease-premium hover:-translate-y-0.5 hover:border-accent-blue hover:shadow-[0_0_20px_var(--color-accent-blue-glow-soft)] animate-slide-up-2"
          >
            Explore the Vision
          </a>
        </div>
      </div>
    </section>
  );
}
