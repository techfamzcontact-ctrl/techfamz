"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import ComingSoonDialog from "./ComingSoonDialog";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "TID", href: "/identity" },
  { label: "Partners", href: "/partners" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

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

  const handleJoinClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    setShowComingSoon(true);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-400 ease-smooth flex items-center justify-between ${
          scrolled
            ? "py-2.5 px-5 md:py-3 md:px-8 border-b border-border-glass bg-[rgba(6,11,24,0.85)] backdrop-blur-[20px]"
            : "py-[14px] px-5 md:py-4 md:px-8"
        }`}
      >
        {/* Logo + Text — always links home */}
        <a href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-[-0.02em] text-text-primary no-underline">
          <div className="flex items-center justify-center w-[36px] h-[36px] rounded-full border-[1.5px] border-[rgba(255,255,255,0.9)] overflow-hidden bg-[rgba(255,255,255,0.05)] shrink-0">
            <Image src="/logo.png" alt="Techfamz logo" width={32} height={32} priority className="object-contain" />
          </div>
          <span className="text-[1.25rem]">
            Tech<span className="text-accent-blue-light">famz</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-2 px-4 text-sm font-medium text-text-secondary no-underline rounded-lg transition-colors duration-300 ease-smooth hover:text-text-primary after:content-[''] after:absolute after:bottom-1 after:inset-x-4 after:h-0.5 after:bg-accent-blue after:rounded-[1px] after:scale-x-0 after:transition-transform after:duration-300 after:ease-premium hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <button
          onClick={handleJoinClick}
          className="relative overflow-hidden hidden md:inline-flex items-center justify-center gap-2 shrink-0 py-[10px] px-6 text-[0.875rem] font-semibold text-bg-primary bg-cta-yellow rounded-md cursor-pointer border-none transition-all duration-400 ease-premium hover:-translate-y-0.5 hover:bg-cta-yellow-hover hover:shadow-[0_0_30px_var(--color-cta-yellow-glow)]"
        >
          Join Ecosystem
        </button>

        {/* Mobile Hamburger */}
        <button
          className="flex md:hidden flex-col justify-center gap-1.5 w-8 h-8 bg-transparent border-none cursor-pointer p-0 z-[110] group"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-[22px] h-0.5 bg-text-primary rounded-[2px] transition-all duration-300 ease-premium origin-center ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block w-[22px] h-0.5 bg-text-primary rounded-[2px] transition-all duration-300 ease-premium origin-center ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-[22px] h-0.5 bg-text-primary rounded-[2px] transition-all duration-300 ease-premium origin-center ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`flex md:hidden fixed top-[60px] right-4 z-[99] w-[220px] bg-[rgba(10,16,34,0.95)] backdrop-blur-[20px] border border-border-glass rounded-md p-2 flex-col gap-0.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 ease-premium ${
          menuOpen ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-2 scale-[0.97] pointer-events-none"
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="block w-full text-left py-2.5 px-3.5 text-sm font-medium text-text-secondary no-underline rounded-lg transition-all duration-[250ms] ease-smooth hover:text-text-primary hover:bg-bg-card"
            onClick={handleLinkClick}
          >
            {link.label}
          </a>
        ))}
        <button
          onClick={handleJoinClick}
          className="relative overflow-hidden inline-flex items-center justify-center gap-2 mt-2 w-full text-center py-3 px-6 text-[0.875rem] font-semibold text-bg-primary bg-cta-yellow rounded-md cursor-pointer border-none transition-all duration-400 ease-premium hover:-translate-y-0.5 hover:bg-cta-yellow-hover hover:shadow-[0_0_30px_var(--color-cta-yellow-glow)]"
        >
          Join Ecosystem
        </button>
      </div>

      {/* Coming Soon Dialog */}
      <ComingSoonDialog
        open={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title="Join Ecosystem — Coming Soon"
        description="The Techfamz Ecosystem portal is currently under development. We're building a platform where developers can claim their identity, connect with companies, and unlock opportunities."
      />
    </>
  );
}
