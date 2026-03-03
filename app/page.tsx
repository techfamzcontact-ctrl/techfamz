"use client";

import { useScrollReveal } from "./hooks/useScrollReveal";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ShiftSection from "./components/ShiftSection";
import MissionSection from "./components/MissionSection";
import TIDSection from "./components/TIDSection";
import PartnersSection from "./components/PartnersSection";
import LegalSection from "./components/LegalSection";
import VisionSection from "./components/VisionSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
  useScrollReveal();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ShiftSection />
        <MissionSection />
        <TIDSection />
        <PartnersSection />
        <LegalSection />
        <VisionSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
