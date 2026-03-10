import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Techfamz — Vision, Mission & Legal Foundation",
  description:
    "Discover the vision, mission, and legal foundation behind Techfamz Limited — building a unified technology network for Africa.",
  openGraph: {
    title: "About Techfamz — Vision, Mission & Legal Foundation",
    description:
      "Discover the vision, mission, and legal foundation behind Techfamz Limited.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
