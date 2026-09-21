"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Handshake } from "lucide-react";

export default function CTASection() {
  return (
    <section
      id="join"
      className="relative overflow-hidden py-24 md:py-32 px-6 text-center"
      style={{ background: "var(--gradient-cta)" }}
    >
      {/* Moving Light Beam */}
      <div className="light-beam" />

      {/* Background Glow */}
      <div
        className="bg-glow bg-accent-blue opacity-15 blur-3xl animate-pulse-glow absolute rounded-full w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
      />

      <div className="relative z-10 max-w-[760px] mx-auto">
        <div className="animate-fade-in-up-delay-1">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft shadow-xs">
            Join the Movement
          </span>
          <h2 className="font-black leading-[1.08] mb-6 tracking-tight text-[clamp(2.4rem,5.5vw,3.8rem)]">
            The Next Era of African Tech
            <br />
            <span className="text-gradient-blue">Begins With You.</span>
          </h2>
        </div>

        <p className="animate-fade-in-up-delay-1 text-base md:text-xl text-text-secondary mb-10 leading-relaxed max-w-[620px] mx-auto">
          Claim your verified developer identity, get discovered by forward-thinking companies, and collaborate with top-tier African engineers.
        </p>

        <div className="animate-fade-in-up-delay-2 flex items-center justify-center gap-4 flex-wrap">
          <Button
            asChild
            variant="cta"
            size="lg"
            className="shadow-xl shadow-amber-500/20 rounded-xl px-8 h-14 font-bold text-base"
          >
            <Link href="/identity/claim" className="flex items-center gap-2">
              <Sparkles size={18} />
              Claim Developer Passport
            </Link>
          </Button>

          <Button
            asChild
            variant="outline-glow"
            size="lg"
            className="rounded-xl px-8 h-14 font-semibold text-base"
          >
            <Link href="/partners" className="flex items-center gap-2">
              <Handshake size={18} />
              Partner With Us
            </Link>
          </Button>
        </div>

        <div className="animate-slide-up-1 mt-16 pt-8 border-t border-border-glass max-w-[500px] mx-auto">
          <p className="text-xs text-text-muted tracking-wide uppercase font-bold">
            Techfamz Limited
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Empowering minds. Engineering solutions. Shaping the continent.
          </p>
        </div>
      </div>
    </section>
  );
}
