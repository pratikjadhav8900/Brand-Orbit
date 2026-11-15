"use client";

import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { useFormSubmit } from "@/lib/useFormSubmit";

export function Newsletter() {
  const { status, errorMessage, submit } = useFormSubmit("/api/newsletter");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    submit(Object.fromEntries(form.entries()));
  }

  return (
    <section className="bg-mist py-20 sm:py-24">
      <Container className="flex flex-col items-center gap-8 rounded-3xl bg-navy px-8 py-14 text-center sm:px-16">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Stay Updated
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            Get Our Latest Insights &amp; News.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/65">
            Occasional updates on BrandOrbit&apos;s work, ventures and ideas — no spam.
          </p>

          {status === "success" ? (
            <p className="mt-6 text-sm font-semibold text-teal">
              You&apos;re subscribed — thank you!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/50 focus:border-teal focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center justify-center rounded-full bg-ocean px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-teal disabled:opacity-60"
              >
                {status === "submitting" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-red-300">{errorMessage}</p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
