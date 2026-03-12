import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const baseUrl = "https://techfamz.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: "Techfamz — Engineering the Future of African Technology",
    template: "%s | Techfamz",
  },

  description:
    "Techfamz is building a structured technology ecosystem designed to unify developers, engineers, and forward-thinking companies across Africa and beyond.",

  keywords: [
    "Techfamz",
    "African technology",
    "developer ecosystem",
    "tech talent Africa",
    "TID",
    "Techfamz Identity",
    "developer identity",
    "African developers",
    "tech community Africa",
    "software engineering Africa",
    "developer network",
    "tech infrastructure",
  ],

  authors: [{ name: "Techfamz Limited" }],
  creator: "Techfamz Limited",
  publisher: "Techfamz Limited",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    title: "Techfamz — Engineering the Future of African Technology",
    description:
      "A verified, structured, and scalable ecosystem for African tech talent. Join the movement.",
    url: baseUrl,
    siteName: "Techfamz",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Techfamz — Engineering the Future of African Technology",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Techfamz — Engineering the Future of African Technology",
    description:
      "A verified, structured, and scalable ecosystem for African tech talent. Join the movement.",
    images: ["/og-image.png"],
    creator: "@techfamz",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: baseUrl,
  },

  category: "technology",

  verification: {
    google: "4FYKO26HyOrmUSDInaXUqfoLgq_jR5fVgnyfGQZSHhY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Techfamz Limited",
    url: baseUrl,
    description:
      "Techfamz is building a structured technology ecosystem designed to unify developers, engineers, and forward-thinking companies across Africa and beyond.",
    foundingDate: "2024",
    sameAs: ["https://chat.whatsapp.com/KLihH50meiH8XxvjGsS1cf"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "General Inquiry",
      url: baseUrl,
    },
  };

  return (
    <html lang="en" className={cn("scroll-smooth", "font-sans", inter.variable)} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#060B18" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable}`}
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
