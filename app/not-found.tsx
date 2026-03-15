import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404: Page Not Found | Techfamz",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center pt-20 pb-20 relative overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-accent-blue blur-[180px] opacity-[0.05]" />
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#E8A427] blur-[160px] opacity-[0.03]" />
        
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(to right, #4A9EFF 1px, transparent 1px), linear-gradient(to bottom, #4A9EFF 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }}
        />
      </div>

      <div className="relative max-w-[600px] mx-auto px-5 text-center flex flex-col items-center">
        <div className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter mb-4 select-none">
          <span className="bg-[linear-gradient(135deg,#60a5fa,#3b82f6,#93c5fd)] bg-clip-text text-transparent opacity-90">
            404
          </span>
        </div>
        
        <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-6 tracking-tight">
          Page not found
        </h1>
        
        <p className="text-[1.1rem] text-text-secondary leading-relaxed mb-10 max-w-[400px] mx-auto">
          We couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or perhaps never existed.
        </p>

        <Link
          href="/"
          className="group relative inline-flex items-center justify-center gap-2 py-3.5 px-8 font-semibold text-white rounded-full bg-accent-blue overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_var(--color-accent-blue-glow)]"
        >
          {/* Button core/border effect */}
          <div className="absolute inset-0 rounded-full border border-white/20 transition-colors duration-300 group-hover:border-white/40" />
          
          <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="relative z-10">Return Home</span>
        </Link>
      </div>
    </main>
  );
}
