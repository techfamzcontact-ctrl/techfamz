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
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #060B18 0%, #0A1428 50%, #060B18 100%)",
        overflow: "hidden",
      }}
    >
      {/* Background Glow */}
      <div
        className="bg-glow bg-glow-blue"
        style={{ width: 500, height: 500, top: "20%", left: "50%", transform: "translateX(-50%)" }}
      />

      <div className="section" style={{ textAlign: "center" }}>
        <div className="reveal">
          <span className="section-label">The Techfamz Identity</span>
          <h2 className="section-title">
            One Identity. Verified. Recognized.
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto 48px" }}>
            Introducing <strong style={{ color: "var(--text-primary)" }}>TID</strong> — Techfamz
            Identity Number. A unique developer identity within the Techfamz ecosystem.
          </p>
        </div>

        {/* TID Card */}
        <div
          className="reveal reveal-delay-2"
          style={{
            maxWidth: 560,
            margin: "0 auto 48px",
            padding: 48,
            background: "linear-gradient(135deg, rgba(12, 26, 58, 0.9), rgba(6, 11, 24, 0.95))",
            border: "1px solid var(--accent-blue)",
            borderRadius: "var(--radius-lg)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Inner glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.08), transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <p
            style={{
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "var(--text-muted)",
              marginBottom: 20,
              position: "relative",
            }}
          >
            Developer Identity
          </p>

          <div className="tid-badge" style={{ margin: "0 auto 28px", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="1" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 16c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            TID-DEV-0001
          </div>

          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", position: "relative", margin: 0 }}>
            Your verified, unique, and permanent identity in the Techfamz network.
          </p>
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            maxWidth: 800,
            margin: "0 auto 48px",
          }}
        >
          {features.map((feat, i) => (
            <div
              key={i}
              className={`glass-card stagger-item`}
              style={{
                transitionDelay: `${0.3 + i * 0.1}s`,
                padding: "20px 24px",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent-blue)",
                  flexShrink: 0,
                  boxShadow: "0 0 8px var(--accent-blue-glow)",
                }}
              />
              <span style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>{feat}</span>
            </div>
          ))}
        </div>

        <div className="reveal reveal-delay-4">
          <p style={{ color: "var(--text-muted)", marginBottom: 8, fontSize: "0.95rem" }}>
            TID is more than a number. It is a professional identity within a growing technology network.
          </p>
          <p
            style={{
              color: "var(--accent-blue-light)",
              fontWeight: 600,
              fontSize: "1.05rem",
              letterSpacing: "0.02em",
            }}
          >
            Developer Portal Launching Soon.
          </p>
        </div>
      </div>
    </section>
  );
}
