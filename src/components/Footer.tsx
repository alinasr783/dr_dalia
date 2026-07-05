"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { clinicInfo, socialLinks, Language, translations } from "@/lib/supabaseMock";

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512.001 512.001" className={className}>
      <path
        fill="currentColor"
        d="M360.751,0c-38.107,0-75.756,14.348-104.746,39.219c-0.002-0.002-0.003-0.002-0.005-0.003
        C227.007,14.345,189.358,0,151.253,0C66.47,0,0.056,66.414,0.056,151.197c0,113.135,74.328,249.149,193.981,354.963
        c4.34,3.837,9.847,5.84,15.421,5.84c3.235,0,6.493-0.675,9.556-2.054c8.347-3.761,13.714-12.066,13.714-21.219V333.576
        c0-12.833,10.44-23.273,23.273-23.273c12.833,0,23.273,10.44,23.273,23.273v155.152c0,9.152,5.367,17.458,13.712,21.219
        c8.347,3.761,18.122,2.279,24.979-3.786c58.639-51.859,108.307-114.91,143.633-182.334c32.467-61.964,50.347-123.273,50.347-172.629
        C511.944,66.414,445.532,0,360.751,0z"
      />
      <path
        fill="currentColor"
        fillOpacity="0.3"
        d="M151.253,0C66.47,0,0.056,66.414,0.056,151.197c0,113.135,74.328,249.149,193.981,354.963
        c4.34,3.837,9.847,5.84,15.421,5.84c3.235,0,6.493-0.675,9.556-2.054c8.347-3.761,13.714-12.066,13.714-21.219V333.576
        c0-12.833,10.44-23.273,23.273-23.273V39.216C227.007,14.345,189.358,0,151.253,0z"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-.81-.07l.81-2.13z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.117 1.519 5.852L.06 23.498a.5.5 0 00.612.612l5.65-1.46A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.38-1.57.5.5 0 00-.38-.063l-3.654.945.945-3.654a.5.5 0 00-.063-.38A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const t = translations[lang].footer;
  const tClinic = translations[lang].clinic;
  const isAr = lang === "ar";
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinksData = [
    { icon: FacebookIcon, href: socialLinks.facebook, label: "Facebook" },
    { icon: InstagramIcon, href: socialLinks.instagram, label: "Instagram" },
    { icon: TikTokIcon, href: socialLinks.tiktok, label: "TikTok" },
  ];

  return (
    <footer
      id="contact"
      className="relative bg-brand-primary text-white w-full pt-8 pb-8 px-4 md:px-8 lg:px-12"
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-accent/0 via-brand-accent to-brand-accent/0" />

      <div className="max-w-[1200px] mx-auto">
        {/* Main Footer Content - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {/* Column 1: Brand & Social */}
          <div className="space-y-3">
            {/* Logo & Name */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-brand-accent/20 rounded-lg flex items-center justify-center shrink-0">
                <ToothIcon className="w-5 h-5 text-brand-accent" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  {isAr ? clinicInfo.nameAr : clinicInfo.nameEn}
                </h3>
                <p className="text-[10px] text-brand-accent/80 font-medium">
                  {isAr ? "طب الأسنان التجميلي" : "Cosmetic Dentistry"}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs leading-5 text-white/60">
              {t.description}
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-2">
              {socialLinksData.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-brand-primary transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-brand-accent">
              {t.contactUs}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={`https://wa.me/${clinicInfo.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-brand-accent transition-colors text-xs"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${tClinic.phone}`}
                  className="flex items-center gap-2 text-white/70 hover:text-brand-accent transition-colors text-xs"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <span>{tClinic.phone}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Address */}
          <div className="space-y-3 md:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-bold text-brand-accent">
              {t.address}
            </h4>
            <div className="flex items-start gap-2">
              <MapPinIcon className="w-4 h-4 shrink-0 mt-0.5 text-white/50" />
              <p className="text-xs leading-5 text-white/60">
                {tClinic.address}
              </p>
            </div>

            {/* Working Hours - hidden on mobile */}
            <div className="hidden md:flex flex-col gap-0.5 text-[11px] text-white/50">
              <span>{isAr ? "السبت - الأربعاء" : "Sat - Wed"}: 10:00 AM - 9:00 PM</span>
              <span>{isAr ? "الخميس" : "Thu"}: 10:00 AM - 5:00 PM</span>
              <span className="italic">{isAr ? "الجمعة: مغلق" : "Fri: Closed"}</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-[11px] text-white/40 text-center">
            {t.copyright}
          </p>
        </div>
      </div>

      {/* Back to Top Button - Mobile Only */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-3 md:hidden w-10 h-10 bg-white/20 backdrop-blur-2xl border-2 border-brand-accent/60 rounded-[12px] flex items-center justify-center z-40 shadow-md shadow-black/5"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4 text-brand-primary" />
        </button>
      )}
    </footer>
  );
}
