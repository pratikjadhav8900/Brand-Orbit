"use client";

import { useFormSubmit } from "@/lib/useFormSubmit";

export function CareersForm() {
  const { status, errorMessage, submit } = useFormSubmit("/api/careers");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    submit(Object.fromEntries(form.entries()));
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-teal/30 bg-teal/5 p-8 text-center">
        <h3 className="text-lg font-bold text-navy">Thanks for reaching out.</h3>
        <p className="mt-2 text-sm text-ink/70">
          We&apos;ve received your note and will be in touch if there&apos;s a fit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-navy">Full Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy focus:border-ocean focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-navy">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy focus:border-ocean focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-navy">
          Role or Vertical You&apos;re Interested In
        </label>
        <input
          type="text"
          name="role"
          required
          placeholder="e.g. Technology & AI, Marketing & Growth, general collaboration"
          className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy focus:border-ocean focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-navy">
          Portfolio / LinkedIn / Resume Link
        </label>
        <input
          type="text"
          name="links"
          placeholder="Paste a link to your portfolio, LinkedIn or resume"
          className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy focus:border-ocean focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-navy">
          Tell us a bit about yourself
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy focus:border-ocean focus:outline-none"
        />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-full bg-ocean px-8 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-teal disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
