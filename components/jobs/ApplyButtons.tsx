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
    ? "inline-flex items-center gap-2 h-11 px-6 bg-cta-yellow text-on-cta text-[15px] font-semibold rounded-lg hover:bg-cta-yellow-hover transition-colors duration-150"
    : "inline-flex items-center gap-2 h-10 px-5 bg-cta-yellow text-on-cta text-sm font-semibold rounded-lg hover:bg-cta-yellow-hover transition-colors duration-150";

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
            ? "h-11 px-5 text-sm rounded-lg"
            : "h-10 px-4 text-xs rounded-lg"
        } ${
          copied
            ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30"
            : "bg-transparent text-text-secondary border-border-glass hover:text-text-primary hover:border-border-glass-hover"
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
