import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner with Techfamz — Access Top African Tech Talent",
  description: "Hire verified developers and collaborate with the fastest growing tech ecosystem in Africa.",
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
