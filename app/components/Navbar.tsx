"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const navLinks = [
  { label: "About", href: "#shift" },
  { label: "TID", href: "#tid" },
  { label: "Partners", href: "#partners" },
  { label: "Vision", href: "#vision" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        {/* Logo + Text */}
        <a href="#" className="navbar-logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1.5px solid rgba(255, 255, 255, 0.9)",
              overflow: "hidden",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              flexShrink: 0,
            }}
          >
            <Image src="/logo.png" alt="Techfamz logo" width={32} height={32} priority style={{ objectFit: "contain" }} />
          </div>
          <span style={{ fontSize: "1.25rem" }}>
            Tech<span style={{ color: "var(--accent-blue-light)" }}>famz</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="nav-links-desktop">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a href="#join" className="btn-primary nav-cta-desktop" style={{ padding: "10px 24px", fontSize: "0.875rem" }}>
          Join Ecosystem
        </a>

        {/* Mobile Hamburger */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="mobile-nav-link"
            onClick={handleLinkClick}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#join"
          className="btn-primary"
          style={{ marginTop: 8, width: "100%", textAlign: "center", padding: "12px 24px", fontSize: "0.875rem" }}
          onClick={handleLinkClick}
        >
          Join Ecosystem
        </a>
      </div>
    </>
  );
}
