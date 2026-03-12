"use client";

import { useState } from "react";
import ComingSoonDialog from "@/components/shared/ComingSoonDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: "Discover Verified Developers",
    desc: "Access a curated pool of developers and engineers, each verified through the Techfamz Identity (TID) system.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Post Opportunities",
    desc: "Share job openings, freelance gigs, and project-based roles directly to a targeted developer community.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    title: "Collaborate on Innovation",
    desc: "Co-create solutions through hackathons, mentorship programs, and joint development initiatives.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Build Ecosystem Relationships",
    desc: "Forge long-term strategic partnerships within a growing, structured African tech ecosystem.",
  },
];

const steps = [
  { step: "01", title: "Apply", desc: "Submit a partnership application through our platform." },
  { step: "02", title: "Review", desc: "Our team evaluates alignment with ecosystem goals." },
  { step: "03", title: "Onboard", desc: "Get integrated into the Techfamz partner network." },
  { step: "04", title: "Grow", desc: "Access talent, collaborate, and scale together." },
];

export default function PartnersPage() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <>
      <main>
        {/* ═══ Hero ═══ */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent-blue opacity-[0.06] blur-[140px]" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#1e3a8a] opacity-[0.08] blur-[120px]" />
          </div>

          {/* Network SVG background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
            <line x1="200" y1="100" x2="100" y2="200" className="network-line" style={{ animationDelay: "0s" }} />
            <line x1="200" y1="100" x2="300" y2="200" className="network-line" style={{ animationDelay: "0.5s" }} />
            <line x1="100" y1="200" x2="200" y2="300" className="network-line" style={{ animationDelay: "1s" }} />
            <line x1="300" y1="200" x2="200" y2="300" className="network-line" style={{ animationDelay: "1.5s" }} />
            {[
              { cx: 200, cy: 100 }, { cx: 100, cy: 200 },
              { cx: 300, cy: 200 }, { cx: 200, cy: 300 },
            ].map((n, i) => (
              <circle key={i} cx={n.cx} cy={n.cy} r="6" className="fill-accent-blue-light" style={{ animation: "networkPulse 4s ease-in-out infinite", animationDelay: `${i * 0.5}s` }} />
            ))}
          </svg>

          <div className="relative z-10 text-center max-w-[800px] px-6 py-32">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-accent-blue-light mb-5 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
              For Companies & Partners
            </span>
            <h1 className="mb-6 text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.02em] font-[800]">
              Access Structured
              <br />
              <span className="bg-[linear-gradient(135deg,#60a5fa,#3b82f6,#93c5fd)] bg-clip-text text-transparent">
                African Tech Talent
              </span>
            </h1>
            <p className="max-w-[600px] mx-auto text-text-secondary text-[1.05rem] leading-relaxed">
              Techfamz is building a curated network of developers and engineers across multiple
              disciplines in modern technology.
            </p>
          </div>
        </section>

        {/* ═══ Benefits Grid ═══ */}
        <section className="relative bg-bg-primary">
          <div className="divider" />
          <div className="relative py-20 px-5 md:py-[100px] md:px-6 max-w-[1000px] mx-auto">
            <div className="reveal text-center mb-14">
              <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
                Partnership Benefits
              </span>
              <h2 className="mb-4">Why Partner With Techfamz</h2>
              <p className="max-w-[600px] mx-auto text-text-secondary">
                We are creating alignment between skill and demand.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {benefits.map((b, i) => (
                <Card
                  key={i}
                  className="bg-bg-card border-border-glass rounded-xl backdrop-blur-md transition-all duration-400 ease-premium hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-border-glass-hover p-0"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <CardContent className="p-7">
                    <div className="w-10 h-10 rounded-lg bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center text-accent-blue-light mb-4">
                      {b.icon}
                    </div>
                    <h3 className="text-[1.05rem] font-semibold mb-2 text-text-primary">{b.title}</h3>
                    <p className="text-[0.9rem] m-0 text-text-secondary">{b.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ How It Works ═══ */}
        <section className="relative" style={{ background: "var(--gradient-section-alt)" }}>
          <div className="divider" />
          <div className="relative py-20 px-5 md:py-[100px] md:px-6 max-w-[900px] mx-auto">
            <div className="reveal text-center mb-14">
              <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
                Process
              </span>
              <h2 className="mb-4">How Partnership Works</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className="stagger-item text-center"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="text-[2.5rem] font-[800] text-accent-blue opacity-20 mb-2">
                    {s.step}
                  </div>
                  <h3 className="text-[1rem] font-semibold text-text-primary mb-2">{s.title}</h3>
                  <p className="text-[0.85rem] text-text-secondary m-0">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="relative bg-bg-primary">
          <div className="divider" />
          <div className="relative py-20 px-5 md:py-[100px] md:px-6 max-w-[700px] mx-auto text-center">
            <div className="reveal">
              <h2 className="mb-4">Ready to Partner?</h2>
              <p className="text-text-secondary mb-8 max-w-[500px] mx-auto">
                Join the growing network of organizations investing in structured African tech talent.
              </p>
              <Button
                variant="cta"
                onClick={() => setShowComingSoon(true)}
                className="relative overflow-hidden py-4 px-10 text-[1rem] h-auto rounded-lg after:absolute after:inset-0 after:opacity-0 after:transition-opacity after:duration-400 after:ease-premium hover:after:opacity-100 after:bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.3),transparent_60%)]"
              >
                Apply for Partnership
              </Button>
            </div>
          </div>
        </section>
      </main>
      <ComingSoonDialog
        open={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title="Partnership Portal — Coming Soon"
        description="Our partnership application platform is currently under development. We're building a seamless way for organizations to connect with verified African tech talent."
      />
    </>
  );
}
