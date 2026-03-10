"use client";

import { useState } from "react";
import ComingSoonDialog from "./ComingSoonDialog";

export default function CTASection() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <section
      id="join"
      className="relative bg-[linear-gradient(180deg,#060B18_0%,#0C1A3A_50%,#060B18_100%)] overflow-hidden py-[120px] px-6 text-center"
    >
      {/* Moving Light Beam */}
      <div className="light-beam" />

      {/* Background Glow */}
      <div
        className="bg-glow bg-accent-blue opacity-12 blur-[120px] animate-pulse-glow absolute rounded-full w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
      />

      <div className="relative z-10 max-w-[700px] mx-auto">
        <div className="reveal">
          <h2 className="font-[800] leading-[1.1] mb-6 tracking-[-0.03em] text-[clamp(2.25rem,5vw,3.5rem)]">
            The Next Phase
            <br />
            <span className="text-accent-blue-light">Begins Now.</span>
          </h2>
        </div>

        <p className="reveal reveal-delay-1 text-[1.15rem] text-text-secondary mb-10 leading-[1.7]">
          Join a platform built for serious builders.
        </p>

        <div className="reveal reveal-delay-2">
          <button
            onClick={() => setShowComingSoon(true)}
            className="relative overflow-hidden inline-flex items-center justify-center gap-2 py-[18px] px-12 text-[1.1rem] font-semibold text-bg-primary bg-cta-yellow rounded-md border-none cursor-pointer transition-all duration-400 ease-premium hover:-translate-y-0.5 hover:bg-cta-yellow-hover hover:shadow-[0_0_30px_var(--color-cta-yellow-glow)] after:absolute after:inset-0 after:opacity-0 after:transition-opacity after:duration-400 after:ease-premium hover:after:opacity-100 after:bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.3),transparent_60%)]"
          >
            Join the Ecosystem
          </button>
        </div>

        <div className="reveal reveal-delay-3 mt-14">
          <p className="text-[0.85rem] text-text-muted tracking-[0.05em]">
            <strong className="text-text-secondary">Techfamz Limited</strong>
          </p>
          <p className="text-[0.8rem] text-text-muted mt-1">
            Empowering minds. Engineering solutions. Shaping the future.
          </p>
        </div>
      </div>

      <ComingSoonDialog
        open={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title="Join Ecosystem — Coming Soon"
        description="The Techfamz Ecosystem portal is currently under development. We're building a platform where developers can claim their identity, connect with companies, and unlock opportunities."
      />
    </section>
  );
}
