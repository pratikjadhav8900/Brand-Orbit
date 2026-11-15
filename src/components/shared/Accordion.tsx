"use client";

import { useState } from "react";
import { clsx } from "clsx";

export interface AccordionItemData {
  title: string;
  content: string;
}

export function Accordion({ items }: { items: AccordionItemData[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? -1 : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-lg font-bold text-white">{item.title}</span>
              <span
                className={clsx(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ocean/30 text-ocean transition-transform duration-300",
                  open && "rotate-45 bg-ocean text-white"
                )}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              className={clsx(
                "grid transition-all duration-300",
                open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-xl text-sm leading-relaxed text-white/70">{item.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
