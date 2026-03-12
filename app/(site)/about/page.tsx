import { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Techfamz — Vision, Mission & Legal Foundation",
  description:
    "Discover the vision, mission, and legal foundation behind Techfamz Limited — building a unified technology network for Africa.",
  openGraph: {
    title: "About Techfamz — Vision, Mission & Legal Foundation",
    description:
      "Discover the vision, mission, and legal foundation behind Techfamz Limited.",
  },
};

const pillars = [
  { title: "Credibility", desc: "Established trust through proper governance and accountability." },
  { title: "Transparency", desc: "Open operations ensuring stakeholder confidence." },
  { title: "Sustainability", desc: "Long-term strategies for enduring impact." },
  { title: "Recognition", desc: "Institutional acknowledgement and formal partnerships." },
];

const timeline = [
  { year: "2024", event: "Techfamz founded as a developer community" },
  { year: "2024", event: "Community grows to 500+ active members" },
  { year: "2025", event: "Transition from community to structured ecosystem" },
  { year: "2025", event: "TID (Techfamz Identity) system announced" },
  { year: "2026", event: "Legal incorporation & partnership platform launch" },
];

export default function AboutPage() {
  return (
    <main>
      {/* ═══ Hero ═══ */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-blue opacity-[0.06] blur-[140px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#1e3a8a] opacity-[0.08] blur-[120px]" />
        </div>
        <div className="relative z-10 text-center max-w-[800px] px-6 py-32">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-accent-blue-light mb-5 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
            About Techfamz
          </span>
          <h1 className="mb-6 text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.02em] font-[800]">
            Building the Infrastructure
            <br />
            <span className="bg-[linear-gradient(135deg,#60a5fa,#3b82f6,#93c5fd)] bg-clip-text text-transparent">
              for African Tech Talent
            </span>
          </h1>
          <p className="max-w-[600px] mx-auto text-text-secondary text-[1.05rem] leading-relaxed">
            From community roots to technology infrastructure — here is the story, the vision, and
            the foundation behind Techfamz.
          </p>
        </div>
      </section>

      {/* ═══ Vision Section ═══ */}
      <section className="relative bg-bg-primary overflow-hidden">
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-accent-blue opacity-[0.05] blur-[120px] pointer-events-none" />
        <div className="divider" />
        <div className="relative py-20 px-5 md:py-[100px] md:px-6 max-w-[900px] mx-auto text-center">
          <div className="reveal">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
              The Vision
            </span>
            <h2 className="mb-6 max-w-[700px] mx-auto">
              A Unified Technology Network for Africa
            </h2>
          </div>

          <div className="reveal reveal-delay-2 max-w-[680px] mx-auto">
            <p className="text-[1.1rem] mb-6">
              Africa holds extraordinary technical potential. Techfamz exists to help organize it.
            </p>
            <p className="mb-8">
              Our long-term vision is to become a recognized digital infrastructure layer where talent,
              innovation, and opportunity intersect seamlessly — locally and globally.
            </p>

            <div className="bg-bg-card border border-[rgba(59,130,246,0.15)] rounded-lg px-10 py-8 backdrop-blur-md text-center">
              <p className="text-[1.1rem] text-text-primary font-medium m-0 leading-relaxed">
                This is not just a platform.
                <br />
                <span className="text-accent-blue-light">
                  It is the beginning of a technology movement.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Timeline Section ═══ */}
      <section className="relative" style={{ background: "var(--gradient-section-alt)" }}>
        <div className="divider" />
        <div className="relative py-20 px-5 md:py-[100px] md:px-6 max-w-[700px] mx-auto">
          <div className="reveal text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
              Our Journey
            </span>
            <h2 className="mb-4">The Road So Far</h2>
          </div>

          <div className="relative pl-8 border-l border-border-glass">
            {timeline.map((item, i) => (
              <div
                key={i}
                className="reveal mb-10 last:mb-0 relative"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {/* Dot */}
                <div className="absolute -left-[calc(2rem+5px)] top-1 w-2.5 h-2.5 rounded-full bg-accent-blue shadow-[0_0_8px_var(--color-accent-blue-glow)]" />
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-accent-blue-light">
                  {item.year}
                </span>
                <p className="text-text-secondary mt-1 m-0">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Legal Foundation ═══ */}
      <section className="relative bg-bg-primary">
        <div className="divider" />
        <div className="relative py-20 px-5 md:py-[100px] md:px-6 max-w-[1200px] mx-auto text-center">
          <div className="reveal">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
              Legal & Structural Foundation
            </span>
            <h2 className="mb-6">Built With Legitimacy. Built to Scale.</h2>
            <p className="max-w-[680px] text-lg text-text-secondary mx-auto mb-12">
              Techfamz Limited is undergoing structured legal and organizational development to ensure
              durability, not temporary growth.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 max-w-[900px] mx-auto">
            {pillars.map((p, i) => (
              <Card
                key={i}
                className="bg-bg-card border-border-glass rounded-lg backdrop-blur-md transition-all duration-400 ease-premium hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-border-glass-hover text-left p-0"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <CardHeader className="p-8 pb-2">
                  <CardTitle className="text-[1.05rem] font-semibold text-accent-blue-light">
                    {p.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <p className="text-[0.9rem] m-0">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
