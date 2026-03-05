"use client";

const partners = [
  { name: "TechCorp", initials: "TC" },
  { name: "InnoVentures", initials: "IV" },
  { name: "AfriDev Labs", initials: "AD" },
  { name: "CloudBase", initials: "CB" },
  { name: "NexaBridge", initials: "NB" },
  { name: "PulseAI", initials: "PA" },
];

export default function TrustedBySection() {
  return (
    <section className="relative bg-bg-primary py-14 overflow-hidden border-t border-b border-border-glass">
      <div className="max-w-[1200px] mx-auto px-5 md:px-6">
        {/* Label */}
        <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-text-muted mb-10 reveal">
          Trusted by forward-thinking organizations
        </p>

        {/* Logo marquee */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-[linear-gradient(to_right,var(--color-bg-primary),transparent)] pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-[linear-gradient(to_left,var(--color-bg-primary),transparent)] pointer-events-none" />

          {/* Scrolling track */}
          <div className="flex animate-[marquee_25s_linear_infinite] gap-12 w-max">
            {/* Duplicate for seamless loop */}
            {[...partners, ...partners].map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 shrink-0 group"
              >
                {/* Logo placeholder */}
                <div className="w-10 h-10 rounded-lg bg-bg-card border border-border-glass flex items-center justify-center text-[0.7rem] font-bold text-text-muted transition-all duration-300 ease-smooth group-hover:border-accent-blue group-hover:text-accent-blue-light group-hover:shadow-[0_0_12px_var(--color-accent-blue-glow-soft)]">
                  {p.initials}
                </div>
                {/* Company name */}
                <span className="text-[0.85rem] font-medium text-text-muted transition-colors duration-300 ease-smooth group-hover:text-text-secondary whitespace-nowrap">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
