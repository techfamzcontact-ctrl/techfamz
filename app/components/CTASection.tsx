"use client";

export default function CTASection() {
  return (
    <section
      id="join"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #060B18 0%, #0C1A3A 50%, #060B18 100%)",
        overflow: "hidden",
        padding: "120px 24px",
        textAlign: "center",
      }}
    >
      {/* Moving Light Beam */}
      <div className="light-beam" />

      {/* Background Glow */}
      <div
        className="bg-glow bg-glow-blue"
        style={{ width: 500, height: 500, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
        <div className="reveal">
          <h2
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: "-0.03em",
            }}
          >
            The Next Phase
            <br />
            <span style={{ color: "var(--accent-blue-light)" }}>Begins Now.</span>
          </h2>
        </div>

        <p
          className="reveal reveal-delay-1"
          style={{
            fontSize: "1.15rem",
            color: "var(--text-secondary)",
            marginBottom: 40,
            lineHeight: 1.7,
          }}
        >
          Join a platform built for serious builders.
        </p>

        <div className="reveal reveal-delay-2">
          <a
            href="#"
            className="btn-primary"
            style={{
              padding: "18px 48px",
              fontSize: "1.1rem",
              borderRadius: "var(--radius-md)",
            }}
          >
            Join the Ecosystem
          </a>
        </div>

        <div className="reveal reveal-delay-3" style={{ marginTop: 56 }}>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              letterSpacing: "0.05em",
            }}
          >
            <strong style={{ color: "var(--text-secondary)" }}>Techfamz Limited</strong>
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            Empowering minds. Engineering solutions. Shaping the future.
          </p>
        </div>
      </div>
    </section>
  );
}
