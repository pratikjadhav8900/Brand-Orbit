import { clsx } from "clsx";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={clsx(
            "mb-3 text-xs font-semibold uppercase tracking-[0.2em]",
            light ? "text-teal" : "text-ocean"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
