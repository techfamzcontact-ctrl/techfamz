import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative bg-bg-brand border-b border-border-glass"
    >
      <div className="max-w-[1140px] mx-auto px-5 md:px-8 pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-[860px]">
          {/* Status line */}
          <p className="eyebrow mb-6 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-blue-light" aria-hidden="true" />
            <span>500+ Community Members Across Africa</span>
          </p>

          {/* Main headline */}
          <h1 className="mb-6 text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.04] tracking-[-0.035em] font-extrabold">
            Engineering the Future
            <br />
            <span className="text-accent-blue-light">
              of African Technology
            </span>
          </h1>

          {/* Sub headline */}
          <p className="max-w-[660px] mb-4 text-text-secondary leading-[1.7] text-[clamp(1.05rem,2.2vw,1.25rem)] font-normal">
            Techfamz is building a structured technology ecosystem designed to unify developers, engineers,
            and forward-thinking companies across Africa and beyond.
          </p>

          <p className="max-w-[560px] mb-10 text-text-muted leading-relaxed text-[0.95rem]">
            What began as a community is evolving into digital infrastructure — built for talent, built for
            opportunity, built for scale.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="cta" size="lg" asChild className="group">
              <Link href="/identity/claim" className="flex items-center gap-2">
                Claim Your Developer TID
                <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#shift">Explore the Vision</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
