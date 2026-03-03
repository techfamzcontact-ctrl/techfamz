"use client";

const benefits = [
  "Discover verified developers",
  "Post opportunities",
  "Collaborate on innovation initiatives",
  "Build strategic ecosystem relationships",
];

export default function PartnersSection() {
  return (
    <section
      id="partners"
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
          className="partners-grid"
        >
          {/* Left: Text Content */}
          <div className="reveal">
            <span className="section-label">For Companies & Partners</span>
            <h2 className="section-title">Access Structured Talent</h2>
            <p style={{ marginBottom: 32 }}>
              Techfamz is building a curated network of developers and engineers across multiple
              disciplines in modern technology. Through our upcoming partnership platform, organizations
              will be able to:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
              {benefits.map((item, i) => (
                <div
                  key={i}
                  className={`stagger-item`}
                  style={{
                    transitionDelay: `${0.2 + i * 0.1}s`,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="10" cy="10" r="9" stroke="var(--accent-blue)" strokeWidth="1.5" />
                    <path d="M6 10l3 3 5-6" stroke="var(--accent-blue-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ color: "var(--text-secondary)" }}>{item}</span>
                </div>
              ))}
            </div>

            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: 24 }}>
              We are creating alignment between skill and demand.
            </p>

            <a href="#join" className="btn-primary" style={{ display: "inline-flex" }}>
              Apply for Partnership
            </a>
          </div>

          {/* Right: Network Animation */}
          <div className="reveal reveal-delay-3" style={{ display: "flex", justifyContent: "center" }}>
            <svg
              viewBox="0 0 400 400"
              style={{ width: "100%", maxWidth: 400, height: "auto" }}
            >
              {/* Connection Lines */}
              <line x1="200" y1="100" x2="100" y2="200" className="network-line" style={{ animationDelay: "0s" }} />
              <line x1="200" y1="100" x2="300" y2="200" className="network-line" style={{ animationDelay: "0.5s" }} />
              <line x1="100" y1="200" x2="200" y2="300" className="network-line" style={{ animationDelay: "1s" }} />
              <line x1="300" y1="200" x2="200" y2="300" className="network-line" style={{ animationDelay: "1.5s" }} />
              <line x1="200" y1="100" x2="200" y2="300" className="network-line" style={{ animationDelay: "2s" }} />
              <line x1="100" y1="200" x2="300" y2="200" className="network-line" style={{ animationDelay: "2.5s" }} />
              <line x1="60" y1="140" x2="100" y2="200" className="network-line" style={{ animationDelay: "1.2s" }} />
              <line x1="340" y1="140" x2="300" y2="200" className="network-line" style={{ animationDelay: "1.8s" }} />
              <line x1="60" y1="280" x2="100" y2="200" className="network-line" style={{ animationDelay: "0.8s" }} />
              <line x1="340" y1="280" x2="300" y2="200" className="network-line" style={{ animationDelay: "2.2s" }} />
              <line x1="200" y1="300" x2="140" y2="360" className="network-line" style={{ animationDelay: "3s" }} />
              <line x1="200" y1="300" x2="260" y2="360" className="network-line" style={{ animationDelay: "3.5s" }} />

              {/* Main Hub (Company) */}
              <circle cx="200" cy="100" r="18" fill="rgba(59, 130, 246, 0.15)" stroke="var(--accent-blue)" strokeWidth="1.5" />
              <text x="200" y="104" textAnchor="middle" fill="var(--accent-blue-light)" fontSize="10" fontWeight="600">CO</text>

              {/* Developer Nodes */}
              {[
                { cx: 100, cy: 200, label: "DEV" },
                { cx: 300, cy: 200, label: "DEV" },
                { cx: 200, cy: 300, label: "DEV" },
                { cx: 60, cy: 140, label: "ENG" },
                { cx: 340, cy: 140, label: "ENG" },
                { cx: 60, cy: 280, label: "DEV" },
                { cx: 340, cy: 280, label: "DEV" },
                { cx: 140, cy: 360, label: "ENG" },
                { cx: 260, cy: 360, label: "DEV" },
              ].map((node, i) => (
                <g key={i}>
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="14"
                    fill="rgba(59, 130, 246, 0.08)"
                    stroke="var(--accent-blue)"
                    strokeWidth="1"
                    className="network-dot"
                    style={{ animationDelay: `${i * 0.4}s`, fill: "rgba(59, 130, 246, 0.08)" }}
                  />
                  <text
                    x={node.cx}
                    y={node.cy + 4}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="8"
                    fontWeight="500"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .partners-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
