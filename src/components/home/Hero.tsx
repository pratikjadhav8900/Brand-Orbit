"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/shared/Button";
import { Container } from "@/components/shared/Container";
import { KineticMatrix } from "@/components/ui/kinetic-matrix";
import { siteConfig } from "@/data/site";

const introPoints = [
  {
    title: "About Us",
    description: "A founder-led group built around six specialised verticals.",
    href: "/about",
  },
  {
    title: "Our Businesses",
    description: "Marketing, technology, education, media, consulting and ventures.",
    href: "/businesses",
  },
  {
    title: "Contact Us",
    description: "Tell us what you're building — we'll tell you how we can help.",
    href: "/contact",
  },
];

export function Hero() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy pb-20 pt-16 sm:pb-28 sm:pt-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 80% 10%, rgba(37,82,252,0.22) 0%, rgba(12,12,14,0) 70%)",
          }}
          aria-hidden="true"
        />
        <Container className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-teal"
            >
              {siteConfig.name}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl font-bold leading-[1.15] text-white sm:text-4xl md:text-5xl"
            >
              Building Businesses.
              <br />
              Creating What&apos;s Next.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg"
            >
              {siteConfig.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Button href="/businesses" variant="primary">
                Explore Our Businesses
              </Button>
              <Button href="/contact" variant="secondary">
                Let&apos;s Work Together
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10"
          >
            <KineticMatrix
              title="BRANDORBIT"
              className="@container absolute inset-0 rounded-3xl"
              titleClassName="text-[length:clamp(1.75rem,11cqw,5rem)] leading-none sm:text-[length:clamp(1.75rem,11cqw,5rem)] md:text-[length:clamp(1.75rem,11cqw,5rem)]"
            />
          </motion.div>
        </Container>
      </section>

      <section className="bg-bg py-14">
        <Container className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {introPoints.map((point, i) => (
            <motion.a
              key={point.title}
              href={point.href}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group flex gap-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ocean/50 font-dot text-lg font-black text-teal transition-colors duration-300 group-hover:bg-ocean group-hover:text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-bold text-white">{point.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/65">
                  {point.description}
                </p>
              </div>
            </motion.a>
          ))}
        </Container>
      </section>
    </>
  );
}
