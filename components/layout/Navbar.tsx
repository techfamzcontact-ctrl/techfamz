"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ArrowRight, Sparkles } from "lucide-react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "TID Passport", href: "/identity" },
  { label: "Partners", href: "/partners" },
  { label: "Tech Jobs", href: "/jobs" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ease-smooth flex items-center justify-between ${
          scrolled
            ? "py-3 px-5 md:py-3.5 md:px-8 border-b border-border-glass backdrop-blur-xl shadow-lg shadow-black/5"
            : "py-5 px-5 md:py-6 md:px-8"
        }`}
        style={{
          backgroundColor: scrolled ? "var(--surface-glass)" : "transparent",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-text-primary group"
        >
          <div className="flex items-center justify-center w-[36px] h-[36px] rounded-xl border border-accent-blue/30 bg-accent-blue/10 overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:border-accent-blue shadow-sm">
            <Image
              src="/logo.png"
              alt="Techfamz logo"
              width={26}
              height={26}
              priority
              className="object-contain"
            />
          </div>
          <span className="text-[1.25rem] font-black tracking-tight">
            Tech<span className="text-accent-blue-light">famz</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-glass bg-bg-card/70 backdrop-blur-md shadow-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1.5 px-4 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-accent-blue-light bg-accent-blue-glow-soft font-semibold shadow-xs"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-primary/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA + Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button
            asChild
            variant="cta"
            size="sm"
            className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            <Link href="/identity/claim" className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Claim Your TID
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex md:hidden flex-col justify-center gap-1.5 w-9 h-9 items-center rounded-lg bg-bg-card border border-border-glass text-text-primary p-1.5 z-[110]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`flex md:hidden fixed top-[70px] inset-x-4 z-[99] backdrop-blur-2xl border border-border-glass rounded-2xl p-4 flex-col gap-1.5 shadow-2xl transition-all duration-300 ease-premium ${
          menuOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-3 scale-95 pointer-events-none"
        }`}
        style={{ backgroundColor: "var(--surface-dialog)" }}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block w-full py-3 px-4 text-sm font-medium rounded-xl transition-colors ${
                isActive
                  ? "text-accent-blue-light bg-accent-blue-glow-soft font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}

        <div className="flex items-center justify-between py-3 px-4 my-1 border-t border-border-glass">
          <span className="text-sm font-medium text-text-secondary">Theme Mode</span>
          <ThemeToggle />
        </div>

        <Button
          asChild
          variant="cta"
          className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <Link href="/identity/claim">
            Claim Your TID
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </>
  );
}
