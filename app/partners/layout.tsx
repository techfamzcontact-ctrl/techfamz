import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners — Access Structured African Tech Talent | Techfamz",
  description:
    "Partner with Techfamz to access a curated network of verified developers and engineers across Africa. Discover talent, post opportunities, and build ecosystem relationships.",
  openGraph: {
    title: "Partners — Access Structured African Tech Talent | Techfamz",
    description:
      "Partner with Techfamz to access a curated network of verified developers and engineers across Africa.",
  },
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
