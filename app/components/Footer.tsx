"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border-glass py-8 px-6 text-center bg-bg-primary">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between flex-wrap gap-4">
        <p className="text-[0.85rem] text-text-muted m-0">
          © {new Date().getFullYear()} Techfamz Limited. All rights reserved.
        </p>

        <div className="flex gap-6">
          {["Privacy", "Terms", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[0.85rem] text-text-muted no-underline transition-colors duration-300 hover:text-accent-blue-light"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
