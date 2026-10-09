import ApplyPartnershipButton from "@/components/partners/ApplyPartnershipButton";

const benefits = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: "Discover Verified Developers",
    desc: "Access a curated pool of developers and engineers, each verified through the Techfamz Identity (TID) system.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Post Opportunities",
    desc: "Share job openings, freelance gigs, and project-based roles directly to a targeted developer community.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    title: "Collaborate on Innovation",
    desc: "Co-create solutions through hackathons, mentorship programs, and joint development initiatives.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Build Ecosystem Relationships",
    desc: "Forge long-term strategic partnerships within a growing, structured African tech ecosystem.",
  },
];

const steps = [
  { step: "01", title: "Apply", desc: "Submit a partnership application through our platform." },
  { step: "02", title: "Review", desc: "Our team evaluates alignment with ecosystem goals." },
  { step: "03", title: "Onboard", desc: "Get integrated into the Techfamz partner network." },
  { step: "04", title: "Grow", desc: "Access talent, collaborate, and scale together." },
];

export default function PartnersPage() {
  return (
    <main>
      {/* ═══ Hero ═══ */}
      <section className="bg-bg-brand border-b border-border-glass">
        <div className="max-w-[1140px] mx-auto px-5 md:px-8 pt-36 pb-20 md:pt-44 md:pb-24">
          <div className="max-w-[800px]">
            <span className="eyebrow">
              For Companies & Partners
            </span>
            <h1 className="mb-6 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.08] tracking-[-0.03em] font-extrabold">
              Access Structured
              <br />
              <span className="text-accent-blue-light">
                African Tech Talent
              </span>
            </h1>
            <p className="max-w-[600px] text-text-secondary text-[1.1rem] leading-relaxed">
              Techfamz is building a curated network of developers and engineers across multiple
              disciplines in modern technology.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Benefits Grid ═══ */}
      <section className="bg-bg-primary border-b border-border-glass">
        <div className="py-20 px-5 md:py-28 md:px-8 max-w-[1140px] mx-auto">
          <div className="max-w-[640px] mb-14">
            <span className="eyebrow">
              Partnership Benefits
            </span>
            <h2 className="mb-4 tracking-[-0.03em]">Why Partner With Techfamz</h2>
            <p className="text-text-secondary">
              We are creating alignment between skill and demand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            {benefits.map((b, i) => (
              <div key={i} className="border-t border-border-glass pt-6 flex gap-5">
                <div className="shrink-0 w-11 h-11 rounded-lg bg-accent-blue-glow-soft flex items-center justify-center text-accent-blue-light">
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-[1.05rem] font-semibold mb-2 text-text-primary">{b.title}</h3>
                  <p className="text-[0.95rem] m-0 text-text-secondary">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="bg-bg-secondary border-b border-border-glass">
        <div className="py-20 px-5 md:py-28 md:px-8 max-w-[1140px] mx-auto">
          <div className="max-w-[640px] mb-14">
            <span className="eyebrow">
              Process
            </span>
            <h2 className="mb-4 tracking-[-0.03em]">How Partnership Works</h2>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {steps.map((s, i) => (
              <li key={i} className="border-t border-border-glass pt-6">
                <div className="text-sm font-mono font-semibold text-accent-blue-light mb-3">
                  {s.step}
                </div>
                <h3 className="text-[1.05rem] font-semibold text-text-primary mb-2">{s.title}</h3>
                <p className="text-[0.92rem] text-text-secondary m-0">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="bg-bg-primary">
        <div className="py-20 px-5 md:py-28 md:px-8 max-w-[1140px] mx-auto">
          <div className="p-8 md:p-12 rounded-xl border border-border-glass bg-bg-card flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-[560px]">
              <h2 className="mb-3 text-[clamp(1.75rem,3.5vw,2.5rem)] tracking-[-0.03em]">Ready to Partner?</h2>
              <p className="text-text-secondary m-0">
                Join the growing network of organizations investing in structured African tech talent.
              </p>
            </div>
            <div className="shrink-0">
              <ApplyPartnershipButton />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
