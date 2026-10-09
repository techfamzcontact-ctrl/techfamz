"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ArrowRight } from "lucide-react";

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
        className={`fixed top-0 inset-x-0 z-[100] h-16 md:h-[72px] px-5 md:px-8 flex items-center justify-between border-b transition-colors duration-200 ${
          scrolled
            ? "border-border-glass backdrop-blur-md"
            : "border-transparent"
        }`}
        style={{
          backgroundColor: scrolled ? "var(--surface-glass)" : "transparent",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-text-primary"
        >
          <Image
            src="/logo.png"
            alt="Techfamz logo"
            width={32}
            height={32}
            priority
            className="rounded-full object-contain shrink-0"
          />
          <span className="text-[1.2rem] font-extrabold tracking-tight">
            Tech<span className="text-accent-blue-light">famz</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`py-2 px-3.5 text-sm rounded-md transition-colors duration-150 ${
                  isActive
                    ? "text-text-primary font-semibold"
                    : "text-text-secondary font-medium hover:text-text-primary"
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
            className="h-9 px-4 text-sm"
          >
            <Link href="/identity/claim" className="flex items-center gap-1.5">
              Claim Your TID
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="flex md:hidden flex-col justify-center gap-1.5 w-9 h-9 items-center rounded-lg border border-border-glass text-text-primary p-1.5 z-[110]"
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
        className={`flex md:hidden fixed top-[72px] inset-x-4 z-[99] border border-border-glass rounded-xl p-3 flex-col gap-1 shadow-xl transition-opacity duration-150 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "var(--surface-dialog)" }}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`block w-full py-3 px-4 text-sm rounded-lg transition-colors ${
                isActive
                  ? "text-text-primary bg-bg-secondary font-semibold"
                  : "text-text-secondary font-medium hover:text-text-primary hover:bg-bg-secondary"
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
          className="w-full h-11 text-sm flex items-center justify-center gap-2"
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
