import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/shared/Button";
import { Accordion } from "@/components/shared/Accordion";

const accordionItems = [
  {
    title: "Client Services",
    content:
      "We work as a specialised partner across six verticals — marketing, technology, education, media, consulting — helping businesses move faster with the right capability for the job.",
  },
  {
    title: "Venture Building",
    content:
      "Alongside client work, BrandOrbit develops and grows its own ventures, applying our combined expertise to build new businesses from the ground up.",
  },
  {
    title: "Our Approach",
    content:
      "Every engagement follows the same disciplined process: understand the problem, plan carefully, build well, launch with coordination, and scale what works.",
  },
];

export function About() {
  return (
    <section className="bg-bg py-24 sm:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
              About BrandOrbit
            </p>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              One Group. Multiple Possibilities.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Founder-led, BrandOrbit brings specialised business capabilities
              together under one identity — working with businesses today, and
              building ventures of our own for tomorrow.
            </p>

            <div className="mt-8">
              <Accordion items={accordionItems} />
            </div>

            <div className="mt-8">
              <Button href="/about" variant="ghost">
                Learn more about us
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative aspect-[4/5] overflow-hidden rounded-3xl lg:aspect-auto">
            <Image
              src="/images/about-team-unity.jpg"
              alt="BrandOrbit team working together"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
