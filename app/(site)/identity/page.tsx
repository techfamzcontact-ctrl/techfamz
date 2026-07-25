import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-blue opacity-[0.05] blur-3xl" />
        </div>

        {/* Orbital ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="absolute w-[500px] h-[500px] md:w-[650px] md:h-[650px] rounded-full border border-accent-blue opacity-[0.06]"
            style={{ animation: "spin 60s linear infinite" }}
          />
        </div>

        <div className="relative z-10 text-center max-w-[800px] px-6 py-32">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-accent-blue-light mb-5 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
            Techfamz Identity
          </span>
          <h1 className="mb-6 text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.02em] font-[800]">
            One Identity.
            <br />
            <span className="bg-[linear-gradient(135deg,#60a5fa,#3b82f6,#93c5fd)] bg-clip-text text-transparent">
              Verified. Recognized.
            </span>
          </h1>
          <p className="max-w-[600px] mx-auto text-text-secondary text-[1.05rem] leading-relaxed mb-8">
            Introducing <strong className="text-text-primary">TID</strong> — Techfamz Identity Number.
            A unique developer identity within the Techfamz ecosystem.
          </p>

          {/* CTA Button — prominent at the top */}
          <Button variant="cta" asChild className="relative overflow-hidden group py-4 px-10 text-[1rem] font-bold h-auto rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.2)] after:absolute after:inset-0 after:opacity-0 after:transition-opacity after:duration-400 after:ease-premium hover:after:opacity-100 after:bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.3),transparent_60%)]">
            <Link href="/identity/claim" className="flex items-center gap-2">
              Claim Your TID
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          {/* TID Preview Card — below the CTA */}
          <div className="max-w-[480px] mx-auto mt-14 p-10 border border-accent-blue/30 rounded-2xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--bg-card-custom), var(--surface-elevated))" }}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
            <p className="text-[0.75rem] uppercase tracking-[0.2em] text-text-muted mb-5 relative font-mono">
              Developer Identity
            </p>
            <div className="tid-badge mx-auto mb-6 justify-center flex font-mono">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="1" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 16c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              TID-DEV-0001
            </div>
            <p className="text-[0.85rem] text-text-muted relative m-0">
              Your verified, unique, and permanent identity in the Techfamz network.
            </p>
          </div>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </section>

      {/* ═══ Features Grid ═══ */}
      <section className="relative bg-bg-primary">
        <div className="divider" />
        <div className="relative py-20 px-5 md:py-[100px] md:px-6 max-w-[1000px] mx-auto">
          <div className="animate-fade-in-up-delay-1 text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
              What TID Enables
            </span>
            <h2 className="mb-4">More Than a Number</h2>
            <p className="max-w-[600px] mx-auto text-text-secondary">
              TID is a professional identity within a growing technology network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Card
                key={i}
                className="bg-bg-card border-border-glass rounded-xl transition-all duration-400 ease-premium hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-border-glass-hover p-0"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <CardContent className="p-7">
                  <div className="w-10 h-10 rounded-lg bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center text-accent-blue-light mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-[1rem] font-semibold mb-2 text-text-primary">{f.title}</h3>
                  <p className="text-[0.88rem] m-0 text-text-secondary">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Secondary CTA after features */}
          <div className="text-center mt-16">
            <Button variant="cta" asChild className="relative overflow-hidden group py-4 px-10 text-[1rem] font-bold h-auto rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.2)] after:absolute after:inset-0 after:opacity-0 after:transition-opacity after:duration-400 after:ease-premium hover:after:opacity-100 after:bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.3),transparent_60%)]">
              <Link href="/identity/claim" className="flex items-center gap-2">
                Get Started — Claim Your TID
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <p className="text-sm text-text-muted mt-4">Free forever. Takes 30 seconds.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
