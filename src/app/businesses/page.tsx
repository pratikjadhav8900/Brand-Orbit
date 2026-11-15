import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { verticals } from "@/data/verticals";

export const metadata: Metadata = {
  title: "Our Businesses",
  description:
    "Six specialised business verticals under one unified group — marketing, technology, education, media, consulting and venture building.",
};

export default function BusinessesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Businesses"
        title="Six Verticals. One Vision."
        description="Each BrandOrbit vertical is a specialised capability in its own right, connected to the others through one shared identity, standard and ambition."
      />

      <section className="bg-bg py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {verticals.map((v, i) => (
              <Reveal
                key={v.slug}
                delay={i * 0.06}
                className="group rounded-2xl border border-white/10 bg-surface p-8 transition-colors duration-300 hover:border-ocean/40"
              >
                <Link href={`/businesses/${v.slug}`} className="flex h-full flex-col">
                  <span className="text-sm font-semibold text-ocean">{v.index}</span>
                  <h2 className="mt-3 text-2xl font-bold text-white">{v.name}</h2>
                  <p className="mt-3 text-base leading-relaxed text-white/70">
                    {v.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors duration-300 group-hover:text-ocean">
                    Explore {v.shortName}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
