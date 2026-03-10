"use client";

import { useScrollReveal } from "../hooks/useScrollReveal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Establish Credibility",
    desc: "Your TID serves as proof of membership in a structured, verified developer network.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: "Enable Talent Discovery",
    desc: "Companies can search, filter, and discover you through the Techfamz network using your TID.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
      </svg>
    ),
    title: "Connect with Companies",
    desc: "Your identity bridges the gap between your skills and organizations looking for talent.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Unlock Ecosystem Privileges",
    desc: "Access exclusive opportunities, events, and resources reserved for verified TID holders.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Permanent & Secure",
    desc: "Your TID is unique and permanent — a verifiable identity that grows with your career.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Global Recognition",
    desc: "Be part of Africa's most structured developer network, recognized locally and globally.",
  },
];

export default function IdentityPage() {
  useScrollReveal();

  return (
    <>
      <Navbar />
      <main>
        {/* ═══ Hero ═══ */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#040810_0%,#0A1428_50%,#060B18_100%)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent-blue opacity-[0.05] blur-[140px]" />
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
            <p className="max-w-[600px] mx-auto text-text-secondary text-[1.05rem] leading-relaxed mb-10">
              Introducing <strong className="text-text-primary">TID</strong> — Techfamz Identity Number.
              A unique developer identity within the Techfamz ecosystem.
            </p>

            {/* TID Card */}
            <div className="max-w-[480px] mx-auto p-10 bg-[linear-gradient(135deg,rgba(12,26,58,0.9),rgba(6,11,24,0.95))] border border-accent-blue rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
              <p className="text-[0.75rem] uppercase tracking-[0.2em] text-text-muted mb-5 relative">
                Developer Identity
              </p>
              <div className="tid-badge mx-auto mb-6 justify-center flex">
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
            <div className="reveal text-center mb-14">
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
                <div
                  key={i}
                  className="stagger-item bg-bg-card border border-border-glass rounded-xl p-7 backdrop-blur-md transition-all duration-400 ease-premium hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-border-glass-hover"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center text-accent-blue-light mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-[1rem] font-semibold mb-2 text-text-primary">{f.title}</h3>
                  <p className="text-[0.88rem] m-0 text-text-secondary">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Portal CTA ═══ */}
        <section className="relative bg-[linear-gradient(180deg,#060B18_0%,#080F24_100%)]">
          <div className="divider" />
          <div className="relative py-20 px-5 md:py-[100px] md:px-6 max-w-[700px] mx-auto text-center">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 py-1.5 px-4 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-cta-yellow border border-cta-yellow-glow rounded-full bg-[rgba(212,168,75,0.08)] mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-cta-yellow opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cta-yellow" />
                </span>
                Coming Soon
              </div>
              <h2 className="mb-4">Developer Portal Launching Soon</h2>
              <p className="text-text-secondary mb-8 max-w-[550px] mx-auto">
                Claim your TID, build your profile, and get discovered by companies invested
                in African tech talent.
              </p>
              <a
                href="/"
                className="relative overflow-hidden inline-flex items-center justify-center gap-2 py-4 px-10 text-base font-semibold text-bg-primary bg-cta-yellow rounded-lg transition-all duration-400 ease-premium hover:-translate-y-0.5 hover:bg-cta-yellow-hover hover:shadow-[0_0_30px_var(--color-cta-yellow-glow)]"
              >
                Back to Home
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
