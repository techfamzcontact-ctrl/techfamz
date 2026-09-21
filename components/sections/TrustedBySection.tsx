"use client";

const partners = [
  { name: "TechCorp Africa", initials: "TC", tag: "Enterprise" },
  { name: "InnoVentures", initials: "IV", tag: "Venture" },
  { name: "AfriDev Labs", initials: "AD", tag: "R&D" },
  { name: "CloudBase Global", initials: "CB", tag: "Cloud" },
  { name: "NexaBridge", initials: "NB", tag: "Fintech" },
  { name: "PulseAI Systems", initials: "PA", tag: "AI/ML" },
];

export default function TrustedBySection() {
  return (
    <section className="relative bg-bg-primary py-12 overflow-hidden border-t border-b border-border-glass">
      <div className="max-w-[1200px] mx-auto px-5 md:px-6">
        {/* Label */}
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-text-muted mb-8 animate-fade-in-up-delay-1">
          Connected with forward-thinking engineering hubs & partners
        </p>

        {/* Logo marquee */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-bg-primary via-bg-primary/80 to-transparent pointer-events-none" />

          {/* Scrolling track */}
          <div className="flex animate-[marquee_30s_linear_infinite] gap-6 w-max py-2">
            {/* Duplicate for seamless loop */}
            {[...partners, ...partners, ...partners].map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-bg-card/70 border border-border-glass backdrop-blur-md shrink-0 transition-all duration-300 hover:border-accent-blue/40 hover:-translate-y-0.5 shadow-xs group cursor-default"
              >
                {/* Logo badge */}
                <div className="w-8 h-8 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-xs font-black text-accent-blue-light group-hover:scale-105 group-hover:bg-accent-blue group-hover:text-white transition-all duration-300">
                  {p.initials}
                </div>
                {/* Company name & tag */}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary group-hover:text-accent-blue-light transition-colors whitespace-nowrap">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
                    {p.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}
