import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/shared/Button";

const audience = ["Strategic Partners", "Entrepreneurs", "Business Owners", "Investors", "Collaborators"];

export function Partnerships() {
  return (
    <section className="bg-gradient-to-br from-ocean to-navy py-24 sm:py-32">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            Partnerships
          </p>
          <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
            Let&apos;s Create Something Bigger.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {audience.map((a) => (
              <span
                key={a}
                className="rounded-full border border-white/25 px-4 py-1.5 text-sm text-white/85"
              >
                {a}
              </span>
            ))}
          </div>
          <div className="mt-10">
            <Button href="/contact?type=partnership" variant="secondary">
              Explore Partnerships
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
