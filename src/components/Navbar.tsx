"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Globe, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { translations, clinicInfo, Language } from "@/lib/supabaseMock";

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512.001 512.001" className={className}>
      <path fill="#ffffff" d="M360.751,0c-38.107,0-75.756,14.348-104.746,39.219c-0.002-0.002-0.003-0.002-0.005-0.003
	C227.007,14.345,189.358,0,151.253,0C66.47,0,0.056,66.414,0.056,151.197c0,113.135,74.328,249.149,193.981,354.963
	c4.34,3.837,9.847,5.84,15.421,5.84c3.235,0,6.493-0.675,9.556-2.054c8.347-3.761,13.714-12.066,13.714-21.219V333.576
	c0-12.833,10.44-23.273,23.273-23.273c12.833,0,23.273,10.44,23.273,23.273v155.152c0,9.152,5.367,17.458,13.712,21.219
	c8.347,3.761,18.122,2.279,24.979-3.786c58.639-51.859,108.307-114.91,143.633-182.334c32.467-61.964,50.347-123.273,50.347-172.629
	C511.944,66.414,445.532,0,360.751,0z"/>
      <path fill="#e0f2fe" d="M151.253,0C66.47,0,0.056,66.414,0.056,151.197c0,113.135,74.328,249.149,193.981,354.963
	c4.34,3.837,9.847,5.84,15.421,5.84c3.235,0,6.493-0.675,9.556-2.054c8.347-3.761,13.714-12.066,13.714-21.219V333.576
	c0-12.833,10.44-23.273,23.273-23.273V39.216C227.007,14.345,189.358,0,151.253,0z"/>
    </svg>
  );
}

export default function Navbar({ lang }: { lang: Language }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = translations[lang].nav;
  const isAr = lang === "ar";

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleLanguage = () => {
    const newLang = isAr ? "en" : "ar";
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath || `/${newLang}`);
  };

  const navLinks = [
    { href: "#home", label: t.home },
    { href: "#services", label: t.services },
    { href: "#before-after", label: t.beforeAfter },
    { href: "#about", label: t.about },
    { href: "#gallery", label: t.gallery },
    { href: "#testimonials", label: t.testimonials },
    { href: "#clinic", label: t.clinic },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const logoSection = (
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-sm">
        <ToothIcon className="w-5 h-5" />
      </div>
      <span className="text-lg font-extrabold text-brand-primary tracking-tight">
        {isAr ? clinicInfo.nameAr : clinicInfo.nameEn}
      </span>
    </div>
  );

  return (
    <>
      <header
        className={`fixed top-3 left-3 right-3 md:top-4 md:left-4 md:right-4 z-50 transition-all duration-300 rounded-[20px] border-2 ${
          scrolled
            ? "bg-white/40 backdrop-blur-3xl border-brand-accent shadow-lg shadow-brand-primary/10 py-1.5"
            : "bg-white/20 backdrop-blur-2xl border-brand-accent/60 shadow-md shadow-black/5 py-2"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
          {logoSection}

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="text-sm font-semibold text-foreground/70 hover:text-brand-primary transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="w-11 h-11 text-brand-primary hover:bg-brand-primary/10 rounded-full cursor-pointer"
              aria-label="Toggle language"
            >
              <Globe className="w-7 h-7" />
            </Button>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="w-11 h-11 text-brand-primary hover:bg-brand-primary/10 rounded-full cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-7 h-7" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Menu Content */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-2xl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {/* Close Button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>

              {/* Logo */}
              <div className="mb-10">{logoSection}</div>

              {/* Navigation Links */}
              <nav className="flex flex-col items-center gap-6">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className="text-2xl font-bold text-foreground/80 hover:text-brand-primary transition-colors cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>

              {/* Language Toggle */}
              <motion.button
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleLanguage();
                }}
                className="mt-10 flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary/10 text-brand-primary font-semibold hover:bg-brand-primary/20 transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Globe className="w-5 h-5" />
                {isAr ? "English" : "العربية"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
