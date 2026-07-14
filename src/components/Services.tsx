"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { servicesDataJson, Language } from "@/lib/supabaseMock";

interface ServicesProps {
  lang: Language;
}

export default function Services({ lang }: ServicesProps) {
  const isAr = lang === "ar";
  const section = servicesDataJson.servicesSection;
  const services = servicesDataJson.services;

  const title = isAr ? section.titleAr : section.titleEn;
  const subtitle = isAr ? section.subtitleAr : section.subtitleEn;

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1, ease: "easeOut" },
    }),
  };

  return (
    <section id="services" className="py-12 px-4 md:px-12 bg-background">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          className="text-center mb-10"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-brand-accent/20 text-brand-primary text-xs font-bold tracking-wider uppercase mb-4">
            {isAr ? "الخدمات" : "What We Offer"}
          </span>
          <h2 className="text-[24px] leading-[32px] font-semibold text-brand-primary mb-4">
            {title}
          </h2>
          <p className="text-sm leading-5 text-foreground/60 max-w-[640px] mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariants}
              className="group relative h-[340px] rounded-2xl overflow-hidden border-2 border-brand-accent/30 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              {/* Full-bleed background image */}
              <Image
                src={service.image}
                alt={isAr ? service.altAr : service.altEn}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Legibility gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

              {/* Floating glass panel (bottom, with margins from edges) */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 p-4 shadow-lg">
                <h3 className="text-[18px] leading-[24px] font-semibold text-white mb-1.5 drop-shadow-sm">
                  {isAr ? service.titleAr : service.titleEn}
                </h3>
                <p className="text-sm leading-5 text-white/90 drop-shadow-sm">
                  {isAr ? service.descAr : service.descEn}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
