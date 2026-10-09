import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Search, UserPlus, Star, Lock, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Techfamz Identity (TID) — Your Developer Passport",
  description:
    "Get verified and recognized in the African tech ecosystem with the Techfamz Identity (TID) system.",
  openGraph: {
    title: "Techfamz Identity (TID) — Your Developer Passport",
    description: "Get verified and recognized in the African tech ecosystem with the Techfamz Identity (TID) system.",
    url: "https://www.techfamz.com/identity",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Techfamz Identity (TID) — Your Developer Passport",
    description: "Get verified and recognized in the African tech ecosystem with the Techfamz Identity (TID) system.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/identity",
  },
};

const features = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Establish Credibility",
    desc: "Your TID serves as proof of membership in a structured, verified developer network.",
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: "Enable Talent Discovery",
    desc: "Companies can search, filter, and discover you through the Techfamz network using your TID.",
  },
  {
    icon: <UserPlus className="w-5 h-5" />,
    title: "Connect with Companies",
    desc: "Your identity bridges the gap between your skills and organizations looking for talent.",
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "Unlock Ecosystem Privileges",
    desc: "Access exclusive opportunities, events, and resources reserved for verified TID holders.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Permanent & Secure",
    desc: "Your TID is unique and permanent — a verifiable identity that grows with your career.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Global Recognition",
    desc: "Be part of Africa's most structured developer network, recognized locally and globally.",
  },
];

export default function IdentityPage() {
  return (
    <main>
      {/* ═══ Hero ═══ */}
      <section className="bg-bg-brand border-b border-border-glass">
        <div className="max-w-[1140px] mx-auto px-5 md:px-8 pt-36 pb-20 md:pt-44 md:pb-24 grid gap-12 md:grid-cols-[1.25fr_1fr] md:items-center">
          <div>
            <span className="eyebrow">
              Techfamz Identity
            </span>
            <h1 className="mb-6 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.08] tracking-[-0.03em] font-extrabold">
              One Identity.
              <br />
              <span className="text-accent-blue-light">
                Verified. Recognized.
              </span>
            </h1>
            <p className="max-w-[560px] text-text-secondary text-[1.1rem] leading-relaxed mb-8">
              Introducing <strong className="text-text-primary">TID</strong> — Techfamz Identity Number.
              A unique developer identity within the Techfamz ecosystem.
            </p>

            <Button variant="cta" size="lg" asChild className="group">
              <Link href="/identity/claim" className="flex items-center gap-2">
                Claim Your TID
                <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          {/* TID Preview Card */}
          <div className="w-full max-w-[440px] md:justify-self-end p-8 md:p-10 rounded-xl border border-border-glass bg-bg-card">
            <p className="text-[0.75rem] uppercase tracking-[0.2em] text-text-muted mb-5 font-mono">
              Developer Identity
            </p>
            <div className="tid-badge mb-6 font-mono">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 16c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              TID-DEV-0001
            </div>
            <p className="text-[0.9rem] text-text-muted m-0">
              Your verified, unique, and permanent identity in the Techfamz network.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Features Grid ═══ */}
      <section className="bg-bg-primary">
        <div className="py-20 px-5 md:py-28 md:px-8 max-w-[1140px] mx-auto">
          <div className="max-w-[640px] mb-14">
            <span className="eyebrow">
              What TID Enables
            </span>
            <h2 className="mb-4 tracking-[-0.03em]">More Than a Number</h2>
            <p className="text-text-secondary">
              TID is a professional identity within a growing technology network.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {features.map((f, i) => (
              <div key={i} className="border-t border-border-glass pt-6">
                <div className="w-10 h-10 rounded-lg bg-accent-blue-glow-soft flex items-center justify-center text-accent-blue-light mb-4">
                  {f.icon}
                </div>
                <h3 className="text-[1.05rem] font-semibold mb-2 text-text-primary">{f.title}</h3>
                <p className="text-[0.92rem] m-0 text-text-secondary">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Secondary CTA after features */}
          <div className="mt-16 p-6 md:p-8 rounded-xl border border-border-glass bg-bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-text-muted m-0">Free forever. Takes 30 seconds.</p>
            <Button variant="cta" size="lg" asChild className="group">
              <Link href="/identity/claim" className="flex items-center gap-2">
                Get Started — Claim Your TID
                <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
