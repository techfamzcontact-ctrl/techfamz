"use client";

export default function VisionSection() {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--bg-primary)",
        overflow: "hidden",
      }}
    >
      {/* Background Glow */}
      <div
        className="bg-glow bg-glow-blue"
        style={{ width: 400, height: 400, bottom: "10%", right: "5%" }}
      />

      <div className="divider" />
      <div className="section" style={{ textAlign: "center" }}>
        <div className="reveal">
          <span className="section-label">The Vision</span>
          <h2 className="section-title" style={{ maxWidth: 700, margin: "0 auto 24px" }}>
            A Unified Technology Network for Africa
          </h2>
        </div>

        <div
          className="reveal reveal-delay-2"
          style={{
            maxWidth: 680,
            margin: "0 auto",
          }}
        >
          <p style={{ fontSize: "1.15rem", marginBottom: 24 }}>
            Africa holds extraordinary technical potential. Techfamz exists to help organize it.
          </p>
          <p style={{ marginBottom: 32 }}>
            Our long-term vision is to become a recognized digital infrastructure layer where talent,
            innovation, and opportunity intersect seamlessly — locally and globally.
          </p>

          <div
            className="glass-card"
            style={{
              padding: "32px 40px",
              textAlign: "center",
              border: "1px solid rgba(59, 130, 246, 0.15)",
            }}
          >
            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--text-primary)",
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              This is not just a platform.
              <br />
              <span style={{ color: "var(--accent-blue-light)" }}>
                It is the beginning of a technology movement.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
