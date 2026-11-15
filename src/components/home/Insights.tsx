import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/shared/Button";
import { insightArticles } from "@/data/insights";

export function Insights() {
  return (
    <section className="bg-surface py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Insights" title="Ideas on Growth, Technology & Business." />
          <Button href="/insights" variant="ghost">
            View all insights
          </Button>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {insightArticles.map((article, i) => (
            <Reveal key={article.slug} delay={i * 0.06} className="rounded-2xl bg-surface-alt p-7">
              {article.status === "unpublished" && (
                <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                  Unpublished draft
                </span>
              )}
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ocean">
                {article.category}
              </p>
              <h3 className="mt-2 text-lg font-bold leading-snug text-white">
                {article.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{article.excerpt}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
