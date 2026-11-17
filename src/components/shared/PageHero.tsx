import { Container } from "./Container";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-navy pb-16 pt-14 sm:pb-20 sm:pt-16">
      <Container>
        <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-teal">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-3xl font-bold leading-[1.15] text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
