"use client";

import { useScrollReveal } from "./hooks/useScrollReveal";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TrustedBySection from "./components/TrustedBySection";
import ShiftSection from "./components/ShiftSection";
import MissionSection from "./components/MissionSection";
import TIDSection from "./components/TIDSection";
import PartnersSection from "./components/PartnersSection";
import LegalSection from "./components/LegalSection";
import VisionSection from "./components/VisionSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import WhatsAppPopup from "./components/WhatsAppPopup";

export default function Home() {
  useScrollReveal();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustedBySection />
        <ShiftSection />
        <MissionSection />
        <TIDSection />
        <PartnersSection />
        <LegalSection />
        <VisionSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppPopup />
    </>
  );
}
