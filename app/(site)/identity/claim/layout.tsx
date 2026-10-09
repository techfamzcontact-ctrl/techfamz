import { Metadata } from "next";

// The claim page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Claim Your TID — Free Developer Passport",
  description:
    "Create your free Techfamz Identity (TID): a permanent developer ID with a public page and QR code that anyone can check.",
  openGraph: {
    title: "Claim Your TID — Free Developer Passport",
    description:
      "Create your free Techfamz Identity (TID): a permanent developer ID with a public page and QR code that anyone can check.",
    url: "https://www.techfamz.com/identity/claim",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claim Your TID — Free Developer Passport",
    description:
      "Create your free Techfamz Identity (TID): a permanent developer ID with a public page and QR code that anyone can check.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/identity/claim",
  },
};

export default function ClaimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
