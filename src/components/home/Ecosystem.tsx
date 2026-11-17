import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { verticals } from "@/data/verticals";

export function Ecosystem() {
  return (
    <section className="bg-navy py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Business Ecosystem"
          title="Six Verticals. One Vision."
          light
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {verticals.map((v, i) => (
            <Reveal key={v.slug} delay={i * 0.05} className="h-full">
              <Link
                href={`/businesses/${v.slug}`}
                className="group flex h-full flex-col justify-between bg-navy p-8 transition-colors duration-300 hover:bg-navy-light"
              >
                <div>
                  <span
                    className={
                      v.accent === "ocean"
                        ? "text-sm font-semibold text-teal"
                        : "text-sm font-semibold text-teal"
                    }
                  >
                    {v.index}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-white">{v.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {v.tagline}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {v.capabilities.slice(0, 3).map((c) => (
                      <li key={c} className="text-xs text-white/45">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors duration-300 group-hover:text-teal">
                  Explore
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
  );
}
