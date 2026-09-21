"use client";

import { Award, Eye, Users, Layers } from "lucide-react";

const items = [
  {
    icon: Award,
    title: "Developers gain recognition",
    description: "Verified identities and portfolios that showcase real capability.",
    color: "#4A9EFF",
  },
  {
    icon: Eye,
    title: "Engineers gain visibility",
    description: "A structured stage where skills are seen by the right organizations.",
    color: "#60A5FA",
  },
  {
    icon: Users,
    title: "Companies gain access",
    description: "Credible, vetted talent connected through a trusted network.",
    color: "#E8A427",
  },
  {
    icon: Layers,
    title: "Innovation gains structure",
    description: "From scattered efforts to organized, scalable technology solutions.",
    color: "#93C5FD",
  },
];

export default function ShiftSection() {
  return (
    <section
      id="shift"
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-section-alt)" }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent-blue blur-3xl opacity-[0.04]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#E8A427] blur-3xl opacity-[0.03]" />
      </div>

      <div className="relative py-20 px-5 md:py-[120px] md:px-6 max-w-[1200px] mx-auto">
        <div className="animate-fade-in-up-delay-1 text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft shadow-xs">
            The Ecosystem Shift
          </span>
          <h2 className="mb-5 text-[clamp(2rem,4.5vw,3.2rem)] font-black tracking-tight">
            From Community to <span className="text-gradient-blue">Technology Infrastructure</span>
          </h2>
          <p className="max-w-[680px] text-base md:text-lg text-text-secondary mx-auto leading-relaxed">
            Techfamz is no longer just a discussion group. We are constructing a verified, structured, and scalable digital network.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group relative bg-bg-card/80 border border-border-glass rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 hover:border-accent-blue/40 hover:shadow-xl hover:shadow-accent-blue/5 animate-slide-up-1 overflow-hidden"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {/* Step pill */}
                <div className="absolute top-5 right-5 text-xs font-mono font-bold text-text-muted/40 group-hover:text-accent-blue-light transition-colors">
                  0{i + 1}
                </div>

                {/* Card hover glow */}
                <div
                  className="absolute -top-20 -right-20 w-36 h-36 rounded-full blur-[50px] opacity-0 group-hover:opacity-25 transition-opacity duration-300 pointer-events-none"
                  style={{ background: item.color }}
                />

                <div
                  className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-6 border shadow-xs transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `${item.color}15`,
                    borderColor: `${item.color}35`,
                    color: item.color,
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 className="text-base md:text-lg mb-2.5 font-bold text-text-primary leading-snug group-hover:text-accent-blue-light transition-colors">
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
        <div className="animate-slide-up-2 mt-16 flex justify-center">
          <div className="relative max-w-[640px] text-center px-6 py-5 rounded-2xl bg-bg-card/60 border border-border-glass backdrop-blur-md shadow-xs">
            <p className="text-text-secondary text-sm md:text-base leading-relaxed m-0">
              <strong className="text-text-primary font-semibold">A deliberate transformation</strong> — from informal gatherings to a structured ecosystem powering African tech careers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
