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
          <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">The Shift</span>
          <h2 className="mb-6">
            From Community to Technology Infrastructure
          </h2>
          <p className="max-w-[680px] text-lg text-text-secondary mx-auto">
            Techfamz is no longer just a gathering place for tech enthusiasts. We are building a
            verified, structured, and scalable ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group bg-bg-card border border-border-glass rounded-xl p-8  transition-all duration-400 ease-premium hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-border-glass-hover animate-slide-up-1 relative overflow-hidden"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {/* Card hover glow */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                  style={{ background: item.color }}
                />

                <div
                  className="relative w-14 h-14 rounded-xl flex items-center justify-center text-xl mb-6 border transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(74,158,255,0.3)] group-hover:scale-110"
                  style={{
                    background: `${item.color}15`,
                    borderColor: `${item.color}30`,
                    color: item.color,
                  }}
                >
                  <Icon size={24} />
                </div>
                <h3 className="text-lg mb-3 font-bold text-text-primary leading-tight">{item.title}</h3>
                <p className="text-[0.925rem] m-0 text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom quote */}
        <div className="animate-slide-up-2 mt-16 flex justify-center">
          <div className="relative max-w-[600px] text-center">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-accent-blue to-transparent rounded-full" />
            <p className="text-text-secondary text-base leading-relaxed pt-6">
              <span className="text-accent-blue-light font-medium">This is a deliberate transition</span> — from informal connection to organized opportunity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
