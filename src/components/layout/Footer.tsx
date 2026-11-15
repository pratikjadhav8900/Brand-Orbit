import Image from "next/image";
import Link from "next/link";
import { footerNav, legalNav } from "@/data/navigation";
import { verticals } from "@/data/verticals";
import { siteConfig } from "@/data/site";
import { CopyrightYear } from "./CopyrightYear";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface text-white/70">
      <div className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 md:grid-cols-4 md:gap-12">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/brandorbit-icon-dark.png"
                alt=""
                width={178}
                height={146}
                className="h-10 w-auto"
              />
              <span className="flex flex-col leading-none">
                <span className="font-wordmark text-xl font-extrabold uppercase tracking-tight text-white">
                  BrandOrbit
                </span>
                <span className="mt-0.5 text-[10px] font-semibold tracking-[0.3em] text-teal">
                  GROUP
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Our Businesses
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {verticals.map((v) => (
                <li key={v.slug}>
                  <Link href={`/businesses/${v.slug}`} className="transition-colors hover:text-teal">
                    {v.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Navigate</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-teal">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="transition-colors hover:text-teal">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:+${siteConfig.contact.whatsapp.number}`}
                  className="transition-colors hover:text-teal"
                >
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li>{siteConfig.contact.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © <CopyrightYear fallback={2026} /> {siteConfig.name}. All rights reserved.
            {siteConfig.legal.entityName ? ` · ${siteConfig.legal.entityName}` : ""}
          </p>
          <div className="flex gap-6">
            {legalNav.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-teal">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
