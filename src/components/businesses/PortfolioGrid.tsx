"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import type { PortfolioProject, VerticalSlug } from "@/types";
import { verticals } from "@/data/verticals";

export function PortfolioGrid({ projects }: { projects: PortfolioProject[] }) {
  const [filter, setFilter] = useState<VerticalSlug | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.verticalSlug === filter)),
    [projects, filter]
  );

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 bg-surface p-12 text-center">
        <p className="text-base text-white/60">
          Project case studies are being finalised and will be published here shortly.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setFilter("all")}
          className={clsx(
            "rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300",
            filter === "all" ? "bg-ocean text-white" : "bg-surface text-white/70 hover:bg-white/10"
          )}
        >
          All Work
        </button>
        {verticals.map((v) => (
          <button
            key={v.slug}
            onClick={() => setFilter(v.slug)}
            className={clsx(
              "rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300",
              filter === v.slug ? "bg-ocean text-white" : "bg-surface text-white/70 hover:bg-white/10"
            )}
          >
            {v.shortName}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <div key={project.slug} className="rounded-2xl border border-white/10 bg-surface p-6">
            <h3 className="font-bold text-white">{project.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{project.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
