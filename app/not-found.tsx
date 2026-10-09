import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404: Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center pt-20 pb-20 bg-bg-primary">
      <div className="max-w-[600px] mx-auto px-5 text-center flex flex-col items-center">
        <div className="text-[120px] md:text-[180px] font-extrabold leading-none tracking-tighter mb-4 select-none text-accent-blue-light">
          404
        </div>
        
        <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-6 tracking-tight">
          Page not found
        </h1>
        
        <p className="text-[1.1rem] text-text-secondary leading-relaxed mb-10 max-w-[400px] mx-auto">
          We couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or perhaps never existed.
        </p>

        <Link
          href="/"
          className="group inline-flex items-center justify-center gap-2 h-11 px-6 font-semibold text-white rounded-lg bg-accent-blue transition-colors duration-150 hover:bg-blue-600"
        >
          <ArrowLeft size={18} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
          <span>Return Home</span>
        </Link>
      </div>
    </main>
  );
}
