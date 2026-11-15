import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { PortfolioGrid } from "@/components/businesses/PortfolioGrid";
import { portfolioProjects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Case studies and projects from across BrandOrbit Group's six verticals.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Turning Ideas Into Impact."
        description="A growing collection of work across our verticals — filter by business to see projects relevant to your needs."
      />
      <section className="bg-mist py-20 sm:py-28">
        <Container>
          <PortfolioGrid projects={portfolioProjects} />
        </Container>
      </section>
    </>
  );
}
