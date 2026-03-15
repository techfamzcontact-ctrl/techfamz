import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner with Techfamz — Access Top African Tech Talent",
  description: "Hire verified developers and collaborate with the fastest growing tech ecosystem in Africa.",
  openGraph: {
    title: "Partner with Techfamz — Access Top African Tech Talent",
    description: "Hire verified developers and collaborate with the fastest growing tech ecosystem in Africa.",
    url: "https://techfamz.com/partners",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Partner with Techfamz — Access Top African Tech Talent",
    description: "Hire verified developers and collaborate with the fastest growing tech ecosystem in Africa.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://techfamz.com/partners",
  },
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
