import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Techfamz — Vision, Mission & Legal Foundation",
  description:
    "Discover the vision, mission, and legal foundation behind Techfamz Limited — building a unified technology network for Africa.",
  openGraph: {
    title: "About Techfamz — Vision, Mission & Legal Foundation",
    description: "Discover the vision, mission, and legal foundation behind Techfamz Limited.",
    url: "https://www.techfamz.com/about",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Techfamz — Vision, Mission & Legal Foundation",
    description: "Discover the vision, mission, and legal foundation behind Techfamz Limited.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/about",
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
      <section className="bg-bg-brand border-b border-border-glass">
        <div className="max-w-[1140px] mx-auto px-5 md:px-8 pt-36 pb-20 md:pt-44 md:pb-24">
          <div className="max-w-[800px]">
            <span className="eyebrow">
              About Techfamz
            </span>
            <h1 className="mb-6 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.08] tracking-[-0.03em] font-extrabold">
              Building the Infrastructure
              <br />
              <span className="text-accent-blue-light">
                for African Tech Talent
              </span>
            </h1>
            <p className="max-w-[600px] text-text-secondary text-[1.1rem] leading-relaxed">
              From community roots to technology infrastructure — here is the story, the vision, and
              the foundation behind Techfamz.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Vision Section ═══ */}
      <section className="bg-bg-primary border-b border-border-glass">
        <div className="py-20 px-5 md:py-28 md:px-8 max-w-[1140px] mx-auto grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <span className="eyebrow">
              The Vision
            </span>
            <h2 className="mb-6 max-w-[520px] tracking-[-0.03em]">
              A Unified Technology Network for Africa
            </h2>
          </div>

          <div>
            <p className="text-[1.1rem] mb-6">
              Africa holds extraordinary technical potential. Techfamz exists to help organize it.
            </p>
            <p className="mb-8">
              Our long-term vision is to become a recognized digital infrastructure layer where talent,
              innovation, and opportunity intersect seamlessly — locally and globally.
            </p>

            <div className="border-l-2 border-accent-blue pl-5">
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
      <section className="bg-bg-secondary border-b border-border-glass">
        <div className="py-20 px-5 md:py-28 md:px-8 max-w-[1140px] mx-auto grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <span className="eyebrow">
              Our Journey
            </span>
            <h2 className="mb-4 tracking-[-0.03em]">The Road So Far</h2>
          </div>

          <ol className="relative pl-8 border-l border-border-glass">
            {timeline.map((item, i) => (
              <li key={i} className="mb-10 last:mb-0 relative">
                {/* Dot */}
                <div className="absolute -left-[calc(2rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-blue" aria-hidden="true" />
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-accent-blue-light">
                  {item.year}
                </span>
                <p className="text-text-secondary mt-1 m-0">{item.event}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ Legal Foundation ═══ */}
      <section className="bg-bg-primary">
        <div className="py-20 px-5 md:py-28 md:px-8 max-w-[1140px] mx-auto">
          <div className="max-w-[760px] mb-12">
            <span className="eyebrow">
              Legal & Structural Foundation
            </span>
            <h2 className="mb-6 tracking-[-0.03em]">Built With Legitimacy. Built to Scale.</h2>
            <p className="max-w-[680px] text-lg text-text-secondary">
              Techfamz Limited is undergoing structured legal and organizational development to ensure
              durability, not temporary growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {pillars.map((p, i) => (
              <div key={i} className="border-t border-border-glass pt-6">
                <div className="text-[1.05rem] font-semibold text-text-primary mb-2">
                  {p.title}
                </div>
                <p className="text-[0.95rem] m-0">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
