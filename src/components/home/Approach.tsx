import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { processSteps } from "@/data/process";

export function Approach() {
  return (
    <section className="bg-navy py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Our Approach" title="From Vision to Execution." light />

        <div className="relative mt-16">
          <div
            className="absolute left-5 top-0 h-full w-px bg-white/10 lg:left-1/2 lg:-translate-x-1/2"
            aria-hidden="true"
          />
          <ol className="space-y-12 lg:space-y-16">
            {processSteps.map((step, i) => (
              <Reveal key={step.index} delay={i * 0.05}>
                <li
                  className={`relative flex flex-col gap-4 pl-14 lg:w-1/2 lg:pl-0 ${
                    i % 2 === 0
                      ? "lg:pr-16 lg:text-right"
                      : "lg:ml-auto lg:pl-16"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-teal/40 bg-navy text-sm font-bold text-teal lg:top-0 ${
                      i % 2 === 0 ? "lg:-right-5 lg:left-auto" : "lg:-left-5"
                    }`}
                  >
                    {step.index}
                  </span>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-white/65">
                    {step.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
