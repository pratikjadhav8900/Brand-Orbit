import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { processSteps } from "@/data/process";

export const metadata: Metadata = {
  title: "Our Approach",
  description: "How BrandOrbit Group takes an idea from vision to execution.",
};

export default function ApproachPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Approach"
        title="From Vision to Execution."
        description="Whatever the vertical, our work follows the same disciplined process — understand first, plan carefully, build well, launch with coordination, and scale what works."
      />

      <section className="bg-bg py-20 sm:py-28">
        <Container>
          <div className="space-y-6">
            {processSteps.map((step, i) => (
              <Reveal
                key={step.index}
                delay={i * 0.06}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface p-8 sm:flex-row sm:items-start sm:gap-8"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy text-lg font-bold text-teal">
                  {step.index}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white">{step.title}</h2>
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/70">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
