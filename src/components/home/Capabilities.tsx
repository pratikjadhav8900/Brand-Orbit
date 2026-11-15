import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { verticals } from "@/data/verticals";

export function Capabilities() {
  return (
    <section className="bg-surface py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="What We Can Do For You"
          title="Everything Businesses Need to Move Forward."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {verticals.map((v, i) => (
            <Reveal key={v.slug} delay={i * 0.05}>
              <Link
                href={`/businesses/${v.slug}`}
                className="group block overflow-hidden rounded-2xl bg-surface-alt"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {v.cardImage && (
                    <Image
                      src={v.cardImage}
                      alt={v.name}
                      fill
                      sizes="(min-width: 1024px) 30vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy">
                    {v.index}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white">{v.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{v.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ocean">
                    Learn more
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
