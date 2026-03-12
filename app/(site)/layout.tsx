import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollRevealInit from "@/components/shared/ScrollRevealInit";
import WhatsAppPopup from "@/components/shared/WhatsAppPopup";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollRevealInit />
      <Navbar />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
      <WhatsAppPopup />
    </>
  );
}
