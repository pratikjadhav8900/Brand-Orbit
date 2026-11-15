import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" />
      <section className="bg-white py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-sm text-ink/60">
            This is a draft terms page for development purposes. It must be reviewed
            and finalised with legal guidance, including confirmed legal entity
            details, before the site goes live.
          </p>
          <h2 className="mt-8 text-xl font-bold text-navy">Use of This Website</h2>
          <p className="mt-3 text-base leading-relaxed text-ink/70">
            This website is provided by {siteConfig.name} to share information about
            our business verticals, services and ventures. Content on this site is
            for general informational purposes and does not constitute a binding
            offer of services.
          </p>
          <h2 className="mt-8 text-xl font-bold text-navy">Contact</h2>
          <p className="mt-3 text-base leading-relaxed text-ink/70">
            For questions about these terms, contact us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-ocean">
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
