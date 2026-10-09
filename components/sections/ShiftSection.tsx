import { Award, Eye, Users, Layers } from "lucide-react";

const items = [
  {
    icon: Award,
    title: "Developers gain recognition",
    description: "Verified identities and portfolios that showcase real capability.",
  },
  {
    icon: Eye,
    title: "Engineers gain visibility",
    description: "A structured stage where skills are seen by the right organizations.",
  },
  {
    icon: Users,
    title: "Companies gain access",
    description: "Credible, vetted talent connected through a trusted network.",
  },
  {
    icon: Layers,
    title: "Innovation gains structure",
    description: "From scattered efforts to organized, scalable technology solutions.",
  },
];

export default function ShiftSection() {
  return (
    <section id="shift" className="bg-bg-secondary border-b border-border-glass">
      <div className="py-20 px-5 md:py-28 md:px-8 max-w-[1140px] mx-auto">
        <div className="max-w-[760px] mb-14">
          <span className="eyebrow">
            The Ecosystem Shift
          </span>
          <h2 className="mb-5 text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold tracking-[-0.03em]">
            From Community to <span className="text-accent-blue-light">Technology Infrastructure</span>
          </h2>
          <p className="max-w-[680px] text-base md:text-lg text-text-secondary leading-relaxed">
            Techfamz is no longer just a discussion group. We are constructing a verified, structured, and scalable digital network.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="border-t border-border-glass pt-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent-blue-glow-soft text-accent-blue-light">
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-mono font-semibold text-text-muted">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-base md:text-lg mb-2 font-bold text-text-primary leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm m-0 text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom quote */}
        <div className="mt-16 max-w-[640px] border-l-2 border-accent-blue pl-5">
          <p className="text-text-secondary text-sm md:text-base leading-relaxed m-0">
            <strong className="text-text-primary font-semibold">A deliberate transformation</strong> — from informal gatherings to a structured ecosystem powering African tech careers.
          </p>
        </div>
      </div>
    </section>
  );
}
