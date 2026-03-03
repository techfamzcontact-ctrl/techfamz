"use client";

const pillars = [
  { title: "Credibility", desc: "Established trust through proper governance and accountability." },
  { title: "Transparency", desc: "Open operations ensuring stakeholder confidence." },
  { title: "Sustainability", desc: "Long-term strategies for enduring impact." },
  { title: "Recognition", desc: "Institutional acknowledgement and formal partnerships." },
];

export default function LegalSection() {
  return (
    <section
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #060B18 0%, #080F24 100%)",
      }}
    >
      <div className="divider" />
      <div className="section" style={{ textAlign: "center" }}>
        <div className="reveal">
          <span className="section-label">Legal & Structural Foundation</span>
          <h2 className="section-title">Built With Legitimacy. Built to Scale.</h2>
          <p className="section-subtitle" style={{ margin: "0 auto 48px" }}>
            Techfamz Limited is undergoing structured legal and organizational development to ensure
            durability, not temporary growth.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {pillars.map((p, i) => (
            <div
              key={i}
              className="glass-card stagger-item"
              style={{ transitionDelay: `${i * 0.1}s`, textAlign: "left" }}
            >
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  marginBottom: 8,
                  color: "var(--accent-blue-light)",
                }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: "0.9rem", margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
