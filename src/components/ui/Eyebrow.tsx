import { cn } from "@/lib/utils";

/** Stitch section eyebrow: short blue rule + uppercase label. */
export function Eyebrow({ children, className, tone = "secondary" }: { children: React.ReactNode; className?: string; tone?: "secondary" | "gold" }) {
  return (
    <div className={cn("flex items-center gap-space-xs", className)}>
      <span className={cn("h-0.5 w-6 rounded-full", tone === "gold" ? "bg-accent-gold-light" : "bg-secondary")} />
      <span
        className={cn(
          "font-label-eyebrow text-label-eyebrow font-bold uppercase tracking-widest",
          tone === "gold" ? "text-accent-gold-light" : "text-secondary",
        )}
      >
        {children}
      </span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  as: Tag = "h2",
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-space-xs", align === "center" && "mx-auto max-w-2xl text-center [&>div:first-child]:justify-center", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Tag
        className={cn(
          "font-headline-md text-headline-md font-bold tracking-tight text-on-surface",
          Tag === "h1" ? "md:text-headline-lg" : "lg:text-[34px] lg:leading-[42px]",
        )}
      >
        {title}
      </Tag>
      {description ? <p className="max-w-[68ch] font-body-md text-body-md text-on-surface-variant">{description}</p> : null}
    </div>
  );
}
