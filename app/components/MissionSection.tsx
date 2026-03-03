"use client";

export default function MissionSection() {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--bg-primary)",
      }}
    >
      <div className="divider" />
      <div className="section">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
          className="mission-grid"
        >
          {/* Left */}
          <div className="reveal">
            <span className="section-label">Our Mission</span>
            <h2 className="section-title" style={{ marginBottom: 20 }}>
              Empower Talent.
              <br />
              Engineer Systems.
              <br />
              Create Access.
            </h2>
          </div>

          {/* Right */}
          <div className="reveal reveal-delay-2">
            <p style={{ fontSize: "1.125rem", marginBottom: 24 }}>
              Our mission is simple but ambitious: to design a platform that strengthens the identity,
              credibility, and global relevance of African tech talent.
            </p>
            <p style={{ marginBottom: 24 }}>
              We are engineering systems that remove barriers between skilled developers and meaningful
              opportunities.
            </p>
            <div
              style={{
                display: "flex",
                gap: 32,
                flexWrap: "wrap",
              }}
            >
              {["Not noise.", "Not hype.", "But structure, access, and long-term value."].map(
                (text, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: i === 2 ? "1rem" : "0.875rem",
                      fontWeight: i === 2 ? 600 : 500,
                      color: i === 2 ? "var(--accent-blue-light)" : "var(--text-muted)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {text}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .mission-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
