import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/shared/Button";

export function FinalCta() {
  return (
    <section className="bg-navy py-24 sm:py-32">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Your Next Opportunity Starts Here.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg">
            Whether you&apos;re building a business, exploring a partnership or looking
            for the right expertise, let&apos;s start a conversation.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="primary">
              Discuss Your Project
            </Button>
            <Button href="/contact?type=partnership" variant="secondary">
              Explore Partnerships
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
