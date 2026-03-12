"use client";

export default function MissionSection() {
  return (
    <section className="relative bg-bg-primary">
      <div className="divider" />
      <div className="relative py-20 px-5 md:py-[120px] md:px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left */}
          <div className="reveal">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">Our Mission</span>
            <h2 className="mb-5">
              Empower Talent.
              <br />
              Engineer Systems.
              <br />
              Create Access.
            </h2>
          </div>

          {/* Right */}
          <div className="reveal reveal-delay-2">
            <p className="text-lg mb-6">
              Our mission is simple but ambitious: to design a platform that strengthens the identity,
              credibility, and global relevance of African tech talent.
            </p>
            <p className="mb-6">
              We are engineering systems that remove barriers between skilled developers and meaningful
              opportunities.
            </p>
            <div className="flex gap-8 flex-wrap">
              {["Not noise.", "Not hype.", "But structure, access, and long-term value."].map(
                (text, i) => (
                  <span
                    key={i}
                    className={`tracking-[0.01em] ${
                      i === 2
                        ? "text-base font-semibold text-accent-blue-light"
                        : "text-sm font-medium text-text-muted"
                    }`}
                  >
                    {text}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
