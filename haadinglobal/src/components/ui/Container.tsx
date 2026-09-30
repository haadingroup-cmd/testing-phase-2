import { cn } from "@/lib/utils";

/** 1280px max content container with the Stitch mobile/desktop margins. */
export function Container({ children, className, as: Tag = "div", id }: { children: React.ReactNode; className?: string; as?: "div" | "section"; id?: string }) {
  return (
    <Tag id={id} className={cn("mx-auto w-full max-w-7xl px-margin-mobile md:px-8 lg:px-margin", className)}>
      {children}
    </Tag>
  );
}
