import React from "react";

interface PasswordResetEmailProps {
  resetUrl: string;
  expiresInMinutes: number;
}

/** Admin password-reset email. Plain HTML with inline styles, like TIDWelcomeEmail. */
export function PasswordResetEmail({ resetUrl, expiresInMinutes }: PasswordResetEmailProps) {
  return (
    <div
      style={{
        backgroundColor: "#0b0f17",
        padding: "40px 16px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          backgroundColor: "#131824",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          padding: "32px",
        }}
      >
        <p style={{ fontSize: "20px", fontWeight: 800, color: "#f9fafb", margin: "0 0 24px 0" }}>
          Tech<span style={{ color: "#60a5fa" }}>famz</span>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#9ca3af" }}> Admin</span>
        </p>

        <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#f9fafb", margin: "0 0 12px 0" }}>
          Reset your admin password
        </h1>
        <p style={{ fontSize: "14px", lineHeight: "22px", color: "#d1d5db", margin: "0 0 24px 0" }}>
          Someone asked to reset the password for the Techfamz admin account linked to this email. Use the button
          below to choose a new password. The link works once and expires in {expiresInMinutes} minutes.
        </p>

        <a
          href={resetUrl}
          style={{
            display: "inline-block",
            backgroundColor: "#f0b429",
            color: "#0f1a31",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            padding: "12px 20px",
            borderRadius: "8px",
          }}
        >
          Choose a new password
        </a>

        <p style={{ fontSize: "12px", lineHeight: "18px", color: "#9ca3af", margin: "24px 0 0 0" }}>
          If the button doesn&apos;t work, copy this link into your browser:
          <br />
          <a href={resetUrl} style={{ color: "#60a5fa", wordBreak: "break-all" }}>
            {resetUrl}
          </a>
        </p>

        <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.08)", margin: "24px 0" }} />

        <p style={{ fontSize: "12px", lineHeight: "18px", color: "#9ca3af", margin: 0 }}>
          If you didn&apos;t ask for this, you can ignore this email. Your password stays the same until someone uses
          the link.
        </p>
      </div>
    </div>
  );
}
