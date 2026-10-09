import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section
      id="join"
      className="bg-bg-brand border-y border-border-glass py-24 md:py-28"
    >
      <div className="max-w-[1140px] mx-auto px-5 md:px-8">
        <div className="max-w-[760px]">
          <span className="eyebrow">
            Join the Movement
          </span>
          <h2 className="font-extrabold leading-[1.08] mb-6 tracking-[-0.03em] text-[clamp(2.4rem,5.5vw,3.8rem)]">
            The Next Era of African Tech
            <br />
            <span className="text-accent-blue-light">Begins With You.</span>
          </h2>

          <p className="text-base md:text-xl text-text-secondary mb-10 leading-relaxed max-w-[620px]">
            Claim your verified developer identity, get discovered by forward-thinking companies, and collaborate with top-tier African engineers.
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Button asChild variant="cta" size="lg" className="group">
              <Link href="/identity/claim" className="flex items-center gap-2">
                Claim Developer Passport
                <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/partners">
                Partner With Us
              </Link>
            </Button>
          </div>

          <div className="mt-14 pt-6 border-t border-border-glass">
            <p className="text-xs text-text-muted tracking-wide uppercase font-bold">
              Techfamz Limited
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Empowering minds. Engineering solutions. Shaping the continent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
