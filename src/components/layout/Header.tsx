"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { primaryNav } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 w-full border-b border-navy/10 bg-white transition-shadow duration-300",
        (scrolled || open) && "shadow-md shadow-black/5"
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center" aria-label={siteConfig.name}>
          <Image
            src="/brand/brandorbit-logo.png"
            alt={siteConfig.name}
            width={361}
            height={228}
            priority
            className="h-12 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {primaryNav.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "text-sm font-medium tracking-wide transition-colors duration-200",
                  active ? "text-ocean" : "text-navy/75 hover:text-navy"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-ocean px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-teal"
          >
            Let&apos;s Collaborate
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span
            className={clsx(
              "h-0.5 w-6 bg-navy transition-transform duration-300",
              open && "translate-y-2 rotate-45"
            )}
          />
          <span
            className={clsx("h-0.5 w-6 bg-navy transition-opacity duration-300", open && "opacity-0")}
          />
          <span
            className={clsx(
              "h-0.5 w-6 bg-navy transition-transform duration-300",
              open && "-translate-y-2 -rotate-45"
            )}
          />
        </button>
      </div>

      <div
        className={clsx(
          "fixed inset-0 top-20 z-40 flex flex-col bg-white transition-opacity duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <nav
          className="flex flex-1 flex-col gap-1 px-6 py-8"
          aria-label="Mobile"
        >
          {primaryNav.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              className={clsx(
                "border-b border-navy/10 py-4 text-2xl font-semibold text-navy transition-all duration-300",
                open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-ocean px-6 py-4 text-base font-semibold text-white"
          >
            Let&apos;s Collaborate
          </Link>
        </nav>
      </div>
    </header>
  );
}
