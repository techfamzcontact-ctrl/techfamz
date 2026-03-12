"use client";

export default function VisionSection() {
  return (
    <section
      id="vision"
      className="relative bg-bg-primary overflow-hidden"
    >
      {/* Background Glow */}
      <div
        className="bg-glow bg-accent-blue opacity-12 blur-[120px] animate-pulse-glow absolute rounded-full w-[400px] h-[400px] bottom-[10%] right-[5%] z-0"
      />

      <div className="divider" />
      <div className="relative py-20 px-5 md:py-[120px] md:px-6 max-w-[1200px] mx-auto text-center">
        <div className="reveal">
          <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">The Vision</span>
          <h2 className="mb-6 max-w-[700px] mx-auto">
            A Unified Technology Network for Africa
          </h2>
        </div>

        <div className="reveal reveal-delay-2 max-w-[680px] mx-auto">
          <p className="text-[1.15rem] mb-6">
            Africa holds extraordinary technical potential. Techfamz exists to help organize it.
          </p>
          <p className="mb-8">
            Our long-term vision is to become a recognized digital infrastructure layer where talent,
            innovation, and opportunity intersect seamlessly — locally and globally.
          </p>

          <div className="bg-bg-card border border-[rgba(59,130,246,0.15)] rounded-lg p-8 backdrop-blur-md transition-all duration-400 ease-premium hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-border-glass-hover px-10 py-8 text-center">
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
  );
}
