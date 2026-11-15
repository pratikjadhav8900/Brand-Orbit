import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/shared/Button";

const pillars = [
  {
    title: "Ideate & Validate",
    description: "We identify and test venture opportunities that fit BrandOrbit's strengths.",
  },
  {
    title: "Build",
    description: "Our verticals combine to design, build and launch the venture from the ground up.",
  },
  {
    title: "Grow",
    description: "We invest in scaling each venture, with the option to operate as an independent brand within the BrandOrbit ecosystem.",
  },
];

export function VentureBuilding() {
  return (
    <section className="bg-bg py-24 sm:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Venture Building"
              title="Beyond Services. Building Ventures."
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Alongside our client services, BrandOrbit develops and grows its own
              ventures — applying the combined strength of our verticals to build new
              businesses from the ground up. Future ventures may operate as independent
              brands within the BrandOrbit ecosystem as they mature.
            </p>
            <div className="mt-8">
              <Button href="/businesses/venture-building" variant="ghost">
                Learn about venture building
              </Button>
            </div>
          </Reveal>

          <div className="space-y-6">
            {pillars.map((pillar, i) => (
              <Reveal
                key={pillar.title}
                delay={i * 0.08}
                className="flex gap-5 rounded-2xl border border-white/10 bg-surface p-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-teal">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
