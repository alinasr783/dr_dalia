"use client";

import { use } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  translations,
  galleryItems,
  aboutDoctorImage,
  testimonialsList,
  heroBackground,
  clinicInfo,
  Language,
} from "@/lib/supabaseMock";

/* ─────────────────────────── Page ─────────────────────────── */

export default function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const currentLang = (lang === "ar" ? "ar" : "en") as Language;
  const t = translations[currentLang];
  const isAr = currentLang === "ar";

  const whatsappMessage = isAr
    ? "مرحباً دكتورة داليا، أود حجز موعد استشارة."
    : "Hello Dr. Dalia, I would like to book a consultation appointment.";
  const whatsappUrl = `https://wa.me/${clinicInfo.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ──────── 1. Header / Navbar ──────── */}
      <Navbar lang={currentLang} />

      <main>
        {/* ──────── 2. Hero Section ──────── */}
        <section
          id="home"
          className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-background pt-24 pb-12 px-4 md:px-12"
        >
          <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-8 z-10 relative">
            <div className="space-y-4 text-left">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-[28px] leading-[36px] md:text-[32px] md:leading-[40px] font-semibold text-brand-primary"
              >
                {isAr ? (
                  t.hero.headline
                ) : (
                  <>
                    A <span className="healthy-word">healthy
                      <svg className="healthy-hand-drawn-svg" viewBox="0 0 130 50">
                        {/* Outer hand-drawn circle - red, slightly wobbly */}
                        <path className="hand-circle circle-1" d="M65,4 C90,2 118,8 124,18 C128,28 122,42 100,46 C78,50 42,48 22,44 C6,40 2,28 6,18 C10,6 38,2 65,4" />
                        {/* Inner hand-drawn circle - blue, different irregularity */}
                        <path className="hand-circle circle-2" d="M62,8 C82,5 112,12 118,22 C122,32 116,40 96,44 C72,48 44,46 26,42 C10,38 8,26 12,18 C16,8 40,6 62,8" />
                      </svg>
                    </span> smile, by design
                  </>
                )}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-base leading-6 text-foreground/70"
              >
                {t.hero.subheadline}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="hero-image-wrapper relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-border bg-gradient-to-br from-brand-accent/20 to-brand-accent/10 flex items-center justify-center transition-all duration-500"
            >
              <Image
                src={aboutDoctorImage}
                alt="Dr. Dalia - Professional Dentist"
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="whatsapp-icon w-5 h-5"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.117 1.519 5.852L.06 23.498a.5.5 0 00.612.612l5.65-1.46A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.38-1.57.5.5 0 00-.38-.063l-3.654.945.945-3.654a.5.5 0 00-.063-.38A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              <span>{t.hero.cta}</span>
            </motion.a>
          </div>

          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-brand-accent rounded-full blur-[100px]"
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-brand-accent/50 rounded-full blur-[120px]"
            />
          </div>
        </section>

        {/* Divider */}
        <div className="flex justify-center py-2">
          <div className="w-full max-w-[800px] h-[2px] rounded-full bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent" />
        </div>

        {/* ──────── 3. Smile Gallery ──────── */}
        <section id="gallery" className="py-12 px-4 md:px-12 bg-white">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={sectionVariants}
              className="text-center mb-10"
            >
              <h2 className="text-[24px] leading-[32px] font-semibold text-brand-primary mb-4">
                {t.gallery.title}
              </h2>
              <p className="text-sm leading-5 text-foreground/60">
                {t.gallery.subtitle}
              </p>
            </motion.div>

            <div className="flex flex-col gap-6">
              {galleryItems.slice(0, 3).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative rounded-xl overflow-hidden shadow-sm bg-background border border-border h-64"
                >
                  <Image
                    src={item.image}
                    alt={isAr ? item.altAr : item.altEn}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                    <p className="text-sm leading-5">
                      {t.gallery.items[index]?.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="flex justify-center py-2">
          <div className="w-full max-w-[800px] h-[2px] rounded-full bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent" />
        </div>

        {/* ──────── 4. Before & After ──────── */}
        <section id="before-after" className="py-12 px-4 md:px-12 bg-muted/30">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={sectionVariants}
              className="text-center mb-10"
            >
              <h2 className="text-[24px] leading-[32px] font-semibold text-brand-primary mb-4">
                {t.beforeAfter.title}
              </h2>
              <p className="text-sm leading-5 text-foreground/60">
                {t.beforeAfter.subtitle}
              </p>
            </motion.div>

            <div className="flex flex-col gap-6">
              {t.beforeAfter.cases.map((c, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-xl overflow-hidden shadow-sm border border-border bg-white"
                >
                  <div className="relative h-48 bg-muted flex">
                    <Image
                      src={galleryItems[index]?.image || heroBackground}
                      alt={c.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-[20px] leading-[28px] font-semibold text-brand-primary mb-2">
                      {c.title}
                    </h3>
                    <p className="text-sm leading-5 text-foreground/60">
                      {c.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="flex justify-center py-2">
          <div className="w-full max-w-[800px] h-[2px] rounded-full bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent" />
        </div>

        {/* ──────── 5. About Section ──────── */}
        <section id="about" className="py-12 px-4 md:px-12 bg-muted/30">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-brand-accent/20 text-brand-primary text-xs font-bold tracking-wider uppercase">
                  {t.about.badge}
                </span>
                <h2 className="text-[24px] leading-[32px] font-semibold text-brand-primary">
                  {t.about.title}
                </h2>
                <p className="text-base leading-6 text-foreground/70">
                  {t.about.bio}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative h-64 w-full rounded-2xl overflow-hidden shadow-md border border-border bg-muted flex items-center justify-center"
              >
                <Image
                  src={aboutDoctorImage}
                  alt="Dr. Dalia - Clinical Portrait"
                  fill
                  className="object-cover"
                />
              </motion.div>

              <ul className="space-y-3">
                {t.about.degrees.map((degree, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 text-brand-primary shrink-0" />
                    <span className="text-sm leading-5 text-foreground/60">
                      {degree}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="flex justify-center py-2">
          <div className="w-full max-w-[800px] h-[2px] rounded-full bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent" />
        </div>

        {/* ──────── 6. Patient Stories ──────── */}
        <section id="testimonials" className="py-12 px-4 md:px-12 bg-white">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariants}
              className="text-center mb-10"
            >
              <h2 className="text-[24px] leading-[32px] font-semibold text-brand-primary mb-4">
                {t.testimonials.title}
              </h2>
              <p className="text-sm leading-5 text-foreground/60">
                {t.testimonials.subtitle}
              </p>
            </motion.div>

            <div className="flex flex-col gap-6">
              {testimonialsList.slice(0, 2).map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background p-6 rounded-xl shadow-sm border border-border flex flex-col"
                >
                  <div className="flex gap-1 mb-3 text-amber-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="italic text-foreground/70 mb-6 leading-relaxed text-base">
                    &ldquo;
                    {isAr ? testimonial.reviewAr : testimonial.reviewEn}
                    &rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/30 flex items-center justify-center text-brand-primary font-semibold text-sm">
                      {(isAr ? testimonial.nameAr : testimonial.nameEn).charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-primary">
                        {isAr ? testimonial.nameAr : testimonial.nameEn}
                      </p>
                      <p className="text-xs text-foreground/50">
                        {isAr ? "مريض موثق" : "Verified Patient"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="flex justify-center py-2">
          <div className="w-full max-w-[800px] h-[2px] rounded-full bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent" />
        </div>

        {/* ──────── 7. Our Clinic ──────── */}
        <section id="clinic" className="py-12 px-4 md:px-12 bg-muted/30">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariants}
              className="text-center mb-10"
            >
              <h2 className="text-[24px] leading-[32px] font-semibold text-brand-primary mb-4">
                {t.clinic.title}
              </h2>
              <p className="text-sm leading-5 text-foreground/60">
                {t.clinic.subtitle}
              </p>
            </motion.div>

            <div className="flex flex-col gap-6">
              {/* Map Embed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full h-[300px] rounded-2xl overflow-hidden shadow-md border border-border bg-muted relative flex items-center justify-center"
              >
                <iframe
                  src={clinicInfo.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: "absolute", inset: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t.clinic.mapTitle}
                />
              </motion.div>

              {/* Working Hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="w-full bg-brand-primary text-white rounded-2xl p-6 shadow-md flex flex-col justify-center"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-7 h-7 text-brand-accent" />
                  <h3 className="text-[20px] leading-[28px] font-semibold text-brand-accent">
                    {t.clinic.hours}
                  </h3>
                </div>
                <ul className="space-y-4 text-sm leading-5">
                  {t.clinic.hoursSchedule.map((schedule, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between border-b border-white/20 pb-2"
                    >
                      <span>{schedule.day}</span>
                      <span className="font-semibold">{schedule.time}</span>
                    </li>
                  ))}
                  <li className="flex flex-col pt-2">
                    <span className="mb-1 text-white/80">
                      {t.clinic.fridayNote}
                    </span>
                    <span className="text-xs italic text-brand-accent/70">
                      {t.clinic.fridaySubNote}
                    </span>
                  </li>
                </ul>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-2 bg-white text-brand-primary px-6 py-3 rounded-lg hover:bg-muted transition-colors text-sm font-semibold"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.117 1.519 5.852L.06 23.498a.5.5 0 00.612.612l5.65-1.46A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.38-1.57.5.5 0 00-.38-.063l-3.654.945.945-3.654a.5.5 0 00-.063-.38A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  {t.hero.cta}
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* ──────── 8. Footer ──────── */}
      <Footer lang={currentLang} />
    </div>
  );
}
