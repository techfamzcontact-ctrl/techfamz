import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TID — Techfamz Identity | Your Verified Developer Identity",
  description:
    "TID (Techfamz Identity Number) is a unique, verified developer identity within the Techfamz ecosystem. Establish credibility, unlock opportunities, and join a growing network.",
  openGraph: {
    title: "TID — Techfamz Identity | Your Verified Developer Identity",
    description:
      "A unique, verified developer identity within the Techfamz ecosystem.",
  },
};

export default function IdentityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
