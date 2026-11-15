import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/shared/Button";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "BrandOrbit Group is a founder-led, multi-industry business group bringing together specialised divisions and ventures under one identity.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A Founder-Led Group, Built to Grow."
        description="BrandOrbit Group brings together specialised business divisions and a venture-building arm under one unified identity — serving businesses today and building new ones for tomorrow."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">Who We Are</h2>
            <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">
              BrandOrbit Group is a newly starting, founder-led business group operating
              across six specialised verticals: marketing &amp; growth, technology &amp;
              AI, education, media &amp; creative, business consulting, and venture
              building. Each vertical is operational today, working with businesses as
              a specialised partner.
            </p>
            <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">
              BrandOrbit operates on two models: providing specialised services to
              businesses and organisations, and developing, building and growing its
              own ventures. We are not a single-service agency — we are a parent
              identity bringing multiple capabilities together under one roof.
            </p>
            <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">
              As a new group, we are building deliberately: strengthening each vertical,
              expanding our portfolio of work, and growing the leadership team around
              our founder over time.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="space-y-6">
            <div className="rounded-2xl border border-navy/10 bg-mist p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
                Mission
              </p>
              <p className="mt-4 text-base leading-relaxed text-navy">
                To give businesses and entrepreneurs access to the full range of
                capability they need to grow — and to build new ventures that create
                lasting value.
              </p>
            </div>
            <div className="rounded-2xl border border-navy/10 bg-mist p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
                Vision
              </p>
              <p className="mt-4 text-base leading-relaxed text-navy">
                To grow BrandOrbit into a recognised ecosystem of business divisions and
                independent ventures, each strengthened by the group around it.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-mist py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">Leadership</h2>
            <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-white p-10 shadow-sm">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy text-2xl font-bold text-teal">
                {siteConfig.founder.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="text-xl font-bold text-navy">{siteConfig.founder.name}</h3>
              <p className="text-sm font-semibold uppercase tracking-wider text-ocean">
                {siteConfig.founder.title}
              </p>
              <p className="max-w-xl text-sm leading-relaxed text-ink/65">
                {siteConfig.founder.name} founded BrandOrbit Group to bring specialised
                business capabilities together under one identity, and to build ventures
                that grow alongside the businesses BrandOrbit serves. Additional
                leadership and team profiles will be introduced here as the group grows.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-navy py-20 sm:py-28">
        <Container className="text-center">
          <Reveal>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Want to know more about what we do?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/businesses" variant="primary">
                Explore Our Businesses
              </Button>
              <Button href="/contact" variant="secondary">
                Get in Touch
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
