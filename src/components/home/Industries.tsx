import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { industries, industriesNotice } from "@/data/industries";

export function Industries() {
  return (
    <section className="bg-bg py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Industries We Serve" title="Built for Businesses in Motion." />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => (
            <Reveal
              key={industry.name}
              delay={i * 0.05}
              className="rounded-2xl bg-gradient-to-br from-navy to-navy-light p-8"
            >
              <h3 className="text-lg font-bold text-white">{industry.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {industry.description}
              </p>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-sm text-white/50">{industriesNotice}</p>
      </Container>
    </section>
  );
}
