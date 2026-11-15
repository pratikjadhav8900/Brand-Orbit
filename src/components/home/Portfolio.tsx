import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/shared/Button";
import { portfolioProjects, portfolioPlaceholderNotice } from "@/data/portfolio";

export function Portfolio() {
  return (
    <section className="bg-mist py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Portfolio" title="Turning Ideas Into Impact." />
          <Button href="/portfolio" variant="ghost">
            View full portfolio
          </Button>
        </div>

        {portfolioProjects.length === 0 ? (
          <Reveal className="mt-14 rounded-2xl border border-dashed border-navy/20 bg-white p-12 text-center">
            <p className="text-base text-ink/60">{portfolioPlaceholderNotice}</p>
          </Reveal>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioProjects.slice(0, 3).map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.05} className="rounded-2xl bg-white p-6">
                <h3 className="text-lg font-bold text-navy">{project.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{project.summary}</p>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
