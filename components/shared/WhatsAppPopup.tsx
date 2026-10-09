"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const WHATSAPP_LINK = "https://chat.whatsapp.com/KLihH50meiH8XxvjGsS1cf";

export default function WhatsAppPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [fabVisible, setFabVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Check if user already dismissed recently (24h cooldown)
    const dismissedAt = localStorage.getItem("wa-popup-dismissed");
    if (dismissedAt && Date.now() - parseInt(dismissedAt) < 86400000) {
      const timer = setTimeout(() => setShowFab(true), 0);
      return () => clearTimeout(timer);
    }

    // Show FAB after 2s. The popup itself only opens when the visitor clicks the FAB:
    // an overlay that opens on its own is an intrusive interstitial for Google on mobile.
    const fabTimer = setTimeout(() => setShowFab(true), 2000);

    return () => {
      clearTimeout(fabTimer);
    };
  }, []);

  // Hide FAB on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current + 10) {
        setFabVisible(false); // scrolling down
      } else if (currentY < lastScrollY.current - 10) {
        setFabVisible(true); // scrolling up
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDismiss = useCallback(() => {
    setShowPopup(false);
    localStorage.setItem("wa-popup-dismissed", Date.now().toString());
  }, []);

  const handleJoin = useCallback(() => {
    window.open(WHATSAPP_LINK, "_blank", "noopener,noreferrer");
    handleDismiss();
  }, [handleDismiss]);

  const handleFabClick = useCallback(() => {
    if (showPopup) {
      handleDismiss();
    } else {
      setShowPopup(true);
    }
  }, [showPopup, handleDismiss]);

  return (
    <>
      {/* ───── Backdrop ───── */}
      <div
        className={`fixed inset-0 z-[199] bg-[rgba(0,0,0,0.6)]  transition-opacity duration-300 ease-smooth ${
          showPopup
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleDismiss}
      />

      {/* ───── Popup Modal ───── */}
      <div
        className={`fixed z-[200] bottom-24 right-5 md:right-8 w-[calc(100%-2.5rem)] max-w-[420px] transition-all duration-300 ease-premium ${
          showPopup
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="relative overflow-hidden rounded-xl border border-border-glass bg-bg-card shadow-xl">
          {/* Glow accent */}

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-bg-secondary border border-border-glass text-text-muted hover:text-text-primary transition-all duration-300 ease-smooth"
            aria-label="Close popup"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="relative p-7 md:p-8">
            {/* WhatsApp Icon Badge */}
            <div className="mb-5 flex items-center gap-3.5">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-[rgba(37,211,102,0.12)] border border-[rgba(37,211,102,0.2)]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
                    fill="#25D366"
                  />
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.106-1.138l-.294-.176-2.856.85.85-2.856-.176-.294A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"
                    fill="#25D366"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[#25D366] m-0">
                  Community
                </p>
                <p className="text-[0.82rem] text-text-muted m-0">
                  500+ builders already inside
                </p>
              </div>
            </div>

            {/* Heading */}
            <h3 className="text-[1.35rem] font-bold leading-[1.25] tracking-tight text-text-primary mb-2.5">
              Join the Techfamz
              <br />
              <span className="text-[#25D366]">WhatsApp Community</span>
            </h3>

            {/* Description */}
            <p className="text-[0.92rem] leading-relaxed text-text-secondary mb-6 m-0">
              Get early access to opportunities, connect with verified developers, and be part of conversations shaping African tech.
            </p>

            {/* Member Avatars + Social Proof */}
            <div className="flex items-center gap-3 mb-7">
              <div className="flex -space-x-2.5">
                {["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-bg-card flex items-center justify-center text-[0.6rem] font-bold text-white"
                      style={{ backgroundColor: color, zIndex: 5 - i }}
                    >
                      {["AO", "FK", "ME", "DA", "JB"][i]}
                    </div>
                  )
                )}
              </div>
              <p className="text-[0.78rem] text-text-muted m-0">
                <span className="text-text-secondary font-medium">+500</span>{" "}
                members joined this week
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleJoin}
              className="group relative w-full flex items-center justify-center gap-2.5 py-[14px] px-6 text-[0.95rem] font-semibold text-white bg-[#25D366] rounded-lg border-none cursor-pointer transition-colors duration-150 hover:bg-[#1fb958]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.106-1.138l-.294-.176-2.856.85.85-2.856-.176-.294A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
              </svg>
              Join Community
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-300 ease-premium group-hover:translate-x-1"
              >
                <path
                  d="M3.333 8h9.334M8.667 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Footer note */}
            <p className="text-center text-[0.72rem] text-text-muted mt-4 mb-0">
              Free to join · No spam · Leave anytime
            </p>
          </div>
        </div>
      </div>

      {/* ───── Floating Action Button ───── */}
      <button
        onClick={handleFabClick}
        className={`fixed z-[198] bottom-6 right-5 md:right-8 w-11 h-11 rounded-full flex items-center justify-center bg-brand-navy border border-[rgba(37,211,102,0.3)] cursor-pointer shadow-md transition-[opacity,transform,background-color] duration-200 hover:bg-[#16264a] ${
          showFab && fabVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Join WhatsApp Community"
      >
        {showPopup ? (
          // X icon
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 4l12 12M16 4L4 16"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // WhatsApp icon
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.106-1.138l-.294-.176-2.856.85.85-2.856-.176-.294A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
          </svg>
        )}
      </button>
    </>
  );
}
