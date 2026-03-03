"use client";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-glass)",
        padding: "32px 24px",
        textAlign: "center",
        background: "var(--bg-primary)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
          © {new Date().getFullYear()} Techfamz Limited. All rights reserved.
        </p>

        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-blue-light)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
