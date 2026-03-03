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
      {/* Background Glow Orbs */}
      <div
        className="bg-glow bg-glow-blue"
        style={{ width: 600, height: 600, top: "-10%", right: "-10%" }}
      />
      <div
        className="bg-glow bg-glow-navy"
        style={{ width: 500, height: 500, bottom: "0%", left: "-5%" }}
      />

      {/* Animated Grid Background */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.04,
          pointerEvents: "none",
        }}
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
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <line x1="10%" y1="20%" x2="30%" y2="35%" className="network-line" />
        <line x1="30%" y1="35%" x2="55%" y2="20%" className="network-line" style={{ animationDelay: "1s" }} />
        <line x1="55%" y1="20%" x2="80%" y2="40%" className="network-line" style={{ animationDelay: "2s" }} />
        <line x1="80%" y1="40%" x2="90%" y2="70%" className="network-line" style={{ animationDelay: "0.5s" }} />
        <line x1="20%" y1="70%" x2="45%" y2="80%" className="network-line" style={{ animationDelay: "1.5s" }} />
        <line x1="45%" y1="80%" x2="70%" y2="65%" className="network-line" style={{ animationDelay: "3s" }} />

        <circle cx="10%" cy="20%" r="3" className="network-dot" />
        <circle cx="30%" cy="35%" r="4" className="network-dot" style={{ animationDelay: "1s" }} />
        <circle cx="55%" cy="20%" r="3" className="network-dot" style={{ animationDelay: "2s" }} />
        <circle cx="80%" cy="40%" r="5" className="network-dot" style={{ animationDelay: "0.5s" }} />
        <circle cx="90%" cy="70%" r="3" className="network-dot" style={{ animationDelay: "1.5s" }} />
        <circle cx="20%" cy="70%" r="4" className="network-dot" style={{ animationDelay: "3s" }} />
        <circle cx="45%" cy="80%" r="3" className="network-dot" style={{ animationDelay: "2.5s" }} />
        <circle cx="70%" cy="65%" r="4" className="network-dot" style={{ animationDelay: "1.2s" }} />
      </svg>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 800, padding: "0 24px" }}>
        <h1 className="hero-headline" style={{ marginBottom: 24 }}>
          Engineering the Future of African Technology
        </h1>

        <p
          className="hero-sub"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            maxWidth: 640,
            margin: "0 auto 16px",
            color: "var(--text-secondary)",
            lineHeight: 1.8,
          }}
        >
          Techfamz is building a structured technology ecosystem designed to unify developers, engineers,
          and forward-thinking companies across Africa and beyond.
        </p>

        <p
          className="hero-sub"
          style={{
            fontSize: "1rem",
            maxWidth: 580,
            margin: "0 auto 40px",
            color: "var(--text-muted)",
            lineHeight: 1.75,
            animationDelay: "0.55s",
          }}
        >
          What began as a community is evolving into infrastructure — built for talent, built for
          opportunity, built for scale.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#join" className="btn-primary hero-cta">
            Claim Your Techfamz Identity
          </a>
          <a href="#shift" className="btn-secondary hero-cta-2">
            Explore the Vision
          </a>
        </div>
      </div>
    </section>
  );
}
