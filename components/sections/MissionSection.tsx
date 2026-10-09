export default function MissionSection() {
  return (
    <section className="bg-bg-primary border-b border-border-glass">
      <div className="py-20 px-5 md:py-28 md:px-8 max-w-[1140px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left */}
          <div>
            <span className="eyebrow">Our Mission</span>
            <h2 className="mb-5 tracking-[-0.03em]">
              Empower Talent.
              <br />
              Engineer Systems.
              <br />
              Create Access.
            </h2>
          </div>

          {/* Right */}
          <div>
            <p className="text-lg mb-6">
              Our mission is simple but ambitious: to design a platform that strengthens the identity,
              credibility, and global relevance of African tech talent.
            </p>
            <p className="mb-6">
              We are engineering systems that remove barriers between skilled developers and meaningful
              opportunities.
            </p>
            <div className="flex gap-x-8 gap-y-2 flex-wrap">
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
