import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { CareersForm } from "@/components/shared/CareersForm";

export const metadata: Metadata = {
  title: "Careers & Collaborate",
  description: "Join BrandOrbit Group or collaborate with us across our business verticals.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers & Collaborate"
        title="Grow With BrandOrbit."
        description="As a newly starting, founder-led group, we're building our team deliberately. If you'd like to work with us — as a team member, freelancer or collaborator — we'd like to hear from you."
      />

      <section className="bg-white py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-[1.3fr_0.7fr]">
          <Reveal>
            <CareersForm />
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl border border-navy/10 bg-mist p-7">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
              Open Roles
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              We don&apos;t have specific open roles listed yet, but we&apos;re always
              glad to hear from people interested in any of our six verticals —
              marketing, technology, education, media, consulting or venture building.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
