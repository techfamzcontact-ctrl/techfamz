"use client";

import { useState } from "react";
import { ExternalLink, Mail, Copy, CheckCircle2 } from "lucide-react";

interface ApplyButtonsProps {
  applyUrl: string;
  isEmail: boolean;
  applyHref: string;
  size?: "large" | "normal";
}

export function ApplyButtons({ applyUrl, isEmail, applyHref, size = "large" }: ApplyButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    const emailToCopy = applyUrl.replace(/^mailto:/, "");
    navigator.clipboard.writeText(emailToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLarge = size === "large";

  const primaryBtnClass = isLarge
    ? "inline-flex items-center gap-2 py-3 px-8 bg-accent-blue text-white text-base font-semibold rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-[0_0_20px_var(--color-accent-blue-glow-soft)] hover:shadow-[0_0_30px_var(--color-accent-blue-glow-soft)] hover:-translate-y-0.5"
    : "inline-flex items-center gap-2 py-2.5 px-6 bg-accent-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors";

  if (!isEmail) {
    return (
      <a
        href={applyHref}
        target="_blank"
        rel="noopener noreferrer"
        className={primaryBtnClass}
      >
        Apply Now
        <ExternalLink size={isLarge ? 18 : 16} />
      </a>
    );
  }

  // It's an email link
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={applyHref}
        target="_self"
        className={primaryBtnClass}
      >
        Send Email
        <Mail size={isLarge ? 18 : 16} />
      </a>

      <button
        onClick={handleCopy}
        title="Copy email address"
        className={`inline-flex items-center gap-2 font-semibold transition-colors border ${
          isLarge
            ? "py-3 px-5 text-sm rounded-xl"
            : "py-2.5 px-4 text-xs rounded-lg"
        } ${
          copied
            ? "bg-green-500/10 text-green-400 border-green-500/30"
            : "bg-bg-primary text-text-secondary border-border-glass hover:text-text-primary hover:bg-bg-card"
        }`}
      >
        {copied ? (
          <>
            <CheckCircle2 size={isLarge ? 18 : 16} />
            Email Copied!
          </>
        ) : (
          <>
            <Copy size={isLarge ? 18 : 16} />
            Copy Email
          </>
        )}
      </button>
    </div>
  );
}
