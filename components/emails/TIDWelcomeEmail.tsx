import React from "react";

interface TIDWelcomeEmailProps {
  fullName: string;
  tid: string;
  role: string;
  skills: string[];
  memberSince: string;
  verificationUrl: string;
}

export function TIDWelcomeEmail({
  fullName,
  tid,
  role,
  skills,
  memberSince,
  verificationUrl,
}: TIDWelcomeEmailProps) {
  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#060B18",
        color: "#f1f5f9",
        padding: "0",
        margin: "0",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" as const, marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#f1f5f9",
              margin: "0 0 8px 0",
              letterSpacing: "-0.02em",
            }}
          >
            Tech<span style={{ color: "#60a5fa" }}>famz</span>
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#64748b",
              margin: "0",
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
            }}
          >
            Developer Identity
          </p>
        </div>

        {/* Welcome */}
        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#f1f5f9",
              margin: "0 0 12px 0",
            }}
          >
            Welcome, {fullName}!
          </h2>
          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.7",
              color: "#94a3b8",
              margin: "0",
            }}
          >
            Your Techfamz Identity has been successfully created. You are now
            part of Africa&apos;s most structured developer network.
          </p>
        </div>

        {/* TID Card */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.03))",
            border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "32px",
            textAlign: "center" as const,
          }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "#64748b",
              textTransform: "uppercase" as const,
              letterSpacing: "0.15em",
              margin: "0 0 16px 0",
            }}
          >
            Your Techfamz Identity
          </p>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#60a5fa",
              letterSpacing: "0.08em",
              margin: "0 0 20px 0",
              fontFamily: "'Courier New', monospace",
            }}
          >
            {tid}
          </p>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "16px",
            }}
          >
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 4px 0" }}>
              <strong style={{ color: "#f1f5f9" }}>{fullName}</strong>
            </p>
            <p style={{ fontSize: "13px", color: "#60a5fa", margin: "0 0 8px 0" }}>
              {role}
            </p>
            {skills.length > 0 && (
              <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px 0" }}>
                {skills.join(" · ")}
              </p>
            )}
            <p style={{ fontSize: "12px", color: "#64748b", margin: "0" }}>
              Member since {memberSince}
            </p>
          </div>
        </div>

        {/* Verification Link */}
        <div style={{ textAlign: "center" as const, marginBottom: "32px" }}>
          <a
            href={verificationUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              padding: "14px 32px",
              borderRadius: "10px",
              textDecoration: "none",
            }}
          >
            View Your TID Card
          </a>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "12px" }}>
            Share this link to verify your identity:
            <br />
            <a href={verificationUrl} style={{ color: "#60a5fa", textDecoration: "underline" }}>
              {verificationUrl}
            </a>
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "24px",
            textAlign: "center" as const,
          }}
        >
          <p style={{ fontSize: "12px", color: "#475569", margin: "0 0 4px 0" }}>
            © {new Date().getFullYear()} Techfamz Limited. All rights reserved.
          </p>
          <p style={{ fontSize: "11px", color: "#374151", margin: "0" }}>
            Engineering the Future of African Technology
          </p>
        </div>
      </div>
    </div>
  );
}
