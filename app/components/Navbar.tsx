"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <a href="#" className="navbar-logo">
        Tech<span>famz</span>
      </a>
      <a href="#join" className="btn-primary" style={{ padding: "10px 24px", fontSize: "0.875rem" }}>
        Join Ecosystem
      </a>
    </nav>
  );
}
