"use client";

const items = [
  {
    icon: "✦",
    title: "Developers gain recognition",
    description: "Verified identities and portfolios that showcase real capability.",
  },
  {
    icon: "◈",
    title: "Engineers gain visibility",
    description: "A structured stage where skills are seen by the right organizations.",
  },
  {
    icon: "⬡",
    title: "Companies gain access",
    description: "Credible, vetted talent connected through a trusted network.",
  },
  {
    icon: "◉",
    title: "Innovation gains structure",
    description: "From scattered efforts to organized, scalable technology solutions.",
  },
];

export default function ShiftSection() {
  return (
    <section
      id="shift"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #060B18 0%, #080F24 100%)",
      }}
    >
      <div className="section">
        <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="section-label">The Shift</span>
          <h2 className="section-title">
            From Community to Technology Infrastructure
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Techfamz is no longer just a gathering place for tech enthusiasts. We are building a
            verified, structured, and scalable ecosystem.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className={`glass-card stagger-item`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-md)",
                  background: "var(--accent-blue-glow-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  marginBottom: 20,
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                }}
              >
                {item.icon}
              </div>
              <h3 style={{ fontSize: "1.125rem", marginBottom: 8, fontWeight: 600 }}>{item.title}</h3>
              <p style={{ fontSize: "0.925rem", margin: 0 }}>{item.description}</p>
            </div>
          ))}
        </div>

        <p
          className="reveal reveal-delay-4"
          style={{
            textAlign: "center",
            marginTop: 48,
            color: "var(--text-muted)",
            fontStyle: "italic",
            fontSize: "1rem",
          }}
        >
          This is a deliberate transition — from informal connection to organized opportunity.
        </p>
      </div>
    </section>
  );
}
