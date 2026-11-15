"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { useFormSubmit } from "@/lib/useFormSubmit";
import { verticals } from "@/data/verticals";

type FormType = "enquiry" | "partnership";

export function ContactForm() {
  const searchParams = useSearchParams();
  const [type, setType] = useState<FormType>(
    searchParams.get("type") === "partnership" ? "partnership" : "enquiry"
  );
  const enquiry = useFormSubmit("/api/enquiries");
  const partnership = useFormSubmit("/api/partnerships");

  const active = type === "enquiry" ? enquiry : partnership;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    if (type === "enquiry") {
      enquiry.submit(payload);
    } else {
      partnership.submit(payload);
    }
  }

  if (active.status === "success") {
    return (
      <div className="rounded-2xl border border-teal/30 bg-teal/5 p-8 text-center">
        <h3 className="text-lg font-bold text-navy">Thank you — message received.</h3>
        <p className="mt-2 text-sm text-ink/70">
          We&apos;ll get back to you shortly. In the meantime, feel free to reach us on
          WhatsApp using the button in the corner.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 inline-flex rounded-full bg-mist p-1">
        {(["enquiry", "partnership"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={clsx(
              "rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300",
              type === t ? "bg-navy text-white" : "text-navy/60 hover:text-navy"
            )}
          >
            {t === "enquiry" ? "Business Enquiry" : "Partnership"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Full Name" name="name" required />
          <Field label="Email" name="email" type="email" required />
        </div>

        {type === "enquiry" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Company (optional)" name="company" required={false} />
            <div>
              <label className="mb-2 block text-sm font-medium text-navy">
                Business Vertical
              </label>
              <select
                name="vertical"
                className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy focus:border-ocean focus:outline-none"
              >
                <option value="">Not sure / general enquiry</option>
                {verticals.map((v) => (
                  <option key={v.slug} value={v.shortName}>
                    {v.shortName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Organisation (optional)" name="organisation" required={false} />
            <div>
              <label className="mb-2 block text-sm font-medium text-navy">
                I am a...
              </label>
              <select
                name="partnershipType"
                required
                className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy focus:border-ocean focus:outline-none"
              >
                <option value="">Select one</option>
                <option value="Strategic Partner">Strategic Partner</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Investor">Investor</option>
                <option value="Collaborator">Collaborator</option>
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-navy">Message</label>
          <textarea
            name="message"
            required
            rows={5}
            className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy focus:border-ocean focus:outline-none"
          />
        </div>

        {active.status === "error" && (
          <p className="text-sm text-red-600">{active.errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={active.status === "submitting"}
          className="inline-flex items-center justify-center rounded-full bg-ocean px-8 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-teal disabled:opacity-60"
        >
          {active.status === "submitting" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-navy">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-sm text-navy focus:border-ocean focus:outline-none"
      />
    </div>
  );
}
