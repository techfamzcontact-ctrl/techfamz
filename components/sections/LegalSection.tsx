"use client";

const pillars = [
  { title: "Credibility", desc: "Established trust through proper governance and accountability." },
  { title: "Transparency", desc: "Open operations ensuring stakeholder confidence." },
  { title: "Sustainability", desc: "Long-term strategies for enduring impact." },
  { title: "Recognition", desc: "Institutional acknowledgement and formal partnerships." },
];

export default function LegalSection() {
  return (
    <section
      className="relative bg-[linear-gradient(180deg,#060B18_0%,#080F24_100%)]"
    >
      <div className="divider" />
      <div className="relative py-20 px-5 md:py-[120px] md:px-6 max-w-[1200px] mx-auto text-center">
        <div className="reveal">
          <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">Legal & Structural Foundation</span>
          <h2 className="mb-6">Built With Legitimacy. Built to Scale.</h2>
          <p className="max-w-[680px] text-lg text-text-secondary mx-auto mb-12">
            Techfamz Limited is undergoing structured legal and organizational development to ensure
            durability, not temporary growth.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 max-w-[900px] mx-auto">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="bg-bg-card border border-border-glass rounded-lg p-8 backdrop-blur-md transition-all duration-400 ease-premium hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-border-glass-hover stagger-item text-left"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <h3 className="text-[1.05rem] font-semibold mb-2 text-accent-blue-light">
                {p.title}
              </h3>
              <p className="text-[0.9rem] m-0">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
