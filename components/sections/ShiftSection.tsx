"use client";

const items = [
  {
    icon: "✦",
    title: "Developers gain recognition",
    description: "Verified identities and portfolios that showcase real capability.",
  },
  {
    icon: "◈",
    title: "Engineers gain visibility",
    description: "A structured stage where skills are seen by the right organizations.",
  },
  {
    icon: "⬡",
    title: "Companies gain access",
    description: "Credible, vetted talent connected through a trusted network.",
  },
  {
    icon: "◉",
    title: "Innovation gains structure",
    description: "From scattered efforts to organized, scalable technology solutions.",
  },
];

export default function ShiftSection() {
  return (
    <section
      id="shift"
      className="relative"
      style={{ background: "var(--gradient-section-alt)" }}
    >
      <div className="relative py-20 px-5 md:py-[120px] md:px-6 max-w-[1200px] mx-auto">
        <div className="reveal text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">The Shift</span>
          <h2 className="mb-6">
            From Community to Technology Infrastructure
          </h2>
          <p className="max-w-[680px] text-lg text-text-secondary mx-auto">
            Techfamz is no longer just a gathering place for tech enthusiasts. We are building a
            verified, structured, and scalable ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-bg-card border border-border-glass rounded-lg p-8 backdrop-blur-md transition-all duration-400 ease-premium hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-border-glass-hover stagger-item"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div
                className="w-12 h-12 rounded-md bg-accent-blue-glow-soft flex items-center justify-center text-xl mb-5 border border-[rgba(59,130,246,0.2)]"
              >
                {item.icon}
              </div>
              <h3 className="text-lg mb-2 font-semibold">{item.title}</h3>
              <p className="text-[0.925rem] m-0">{item.description}</p>
            </div>
          ))}
        </div>

        <p
          className="reveal reveal-delay-4 text-center mt-12 text-text-muted italic text-base"
        >
          This is a deliberate transition — from informal connection to organized opportunity.
        </p>
      </div>
    </section>
  );
}
