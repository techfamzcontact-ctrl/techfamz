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
      className="relative bg-bg-primary"
    >
      <div className="divider" />
      <div className="relative py-20 px-5 md:py-[120px] md:px-6 max-w-[1200px] mx-auto">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
        >
          {/* Left: Text Content */}
          <div className="reveal">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">For Companies & Partners</span>
            <h2 className="mb-6">Access Structured Talent</h2>
            <p className="mb-8">
              Techfamz is building a curated network of developers and engineers across multiple
              disciplines in modern technology. Through our upcoming partnership platform, organizations
              will be able to:
            </p>

            <div className="flex flex-col gap-4 mb-9">
              {benefits.map((item, i) => (
                <div
                  key={i}
                  className={`stagger-item flex items-center gap-3.5`}
                  style={{
                    transitionDelay: `${0.2 + i * 0.1}s`,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                    <circle cx="10" cy="10" r="9" stroke="var(--color-accent-blue)" strokeWidth="1.5" />
                    <path d="M6 10l3 3 5-6" stroke="var(--color-accent-blue-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-text-secondary">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-text-muted text-[0.95rem] mb-6">
              We are creating alignment between skill and demand.
            </p>

            <a href="#join" className="relative overflow-hidden inline-flex items-center justify-center gap-2 py-4 px-8 text-base font-semibold text-bg-primary bg-cta-yellow rounded-md transition-all duration-400 ease-premium hover:-translate-y-0.5 hover:bg-cta-yellow-hover hover:shadow-[0_0_30px_var(--color-cta-yellow-glow)] after:absolute after:inset-0 after:opacity-0 after:transition-opacity after:duration-400 after:ease-premium hover:after:opacity-100 after:bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.3),transparent_60%)]">
              Apply for Partnership
            </a>
          </div>

          {/* Right: Network Animation */}
          <div className="reveal reveal-delay-3 flex justify-center">
            <svg
              viewBox="0 0 400 400"
              className="w-full max-w-[400px] h-auto"
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
              <circle cx="200" cy="100" r="18" fill="rgba(59, 130, 246, 0.15)" stroke="var(--color-accent-blue)" strokeWidth="1.5" />
              <text x="200" y="104" textAnchor="middle" fill="var(--color-accent-blue-light)" fontSize="10" fontWeight="600">CO</text>

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
                    stroke="var(--color-accent-blue)"
                    strokeWidth="1"
                    className="network-dot"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                  <text
                    x={node.cx}
                    y={node.cy + 4}
                    textAnchor="middle"
                    fill="var(--color-text-muted)"
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
    </section>
  );
}
