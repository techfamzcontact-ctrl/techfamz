import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Techfamz Blog | Insights & Ecosystem Updates",
  description:
    "Explore the latest insights, tutorials, and updates from the Techfamz ecosystem. Built for developers, engineers, and tech innovators.",
  openGraph: {
    title: "Techfamz Blog | Insights & Ecosystem Updates",
    description:
      "Explore the latest insights, tutorials, and updates from the Techfamz ecosystem. Built for developers, engineers, and tech innovators.",
    url: "https://techfamz.com/blog",
    siteName: "Techfamz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Techfamz Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Techfamz Blog",
    description: "Insights, updates, and deep dives from the tech ecosystem.",
    images: ["/og-image.png"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
