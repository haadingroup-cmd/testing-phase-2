import { cn } from "@/lib/utils";
import { isIconName, type IconName } from "@/lib/icons";

type Props = {
  name: IconName | string;
  size?: number;
  className?: string;
  filled?: boolean;
};

/** Material Symbols glyph (Stitch icon set). Decorative by default. */
export function Icon({ name, size = 20, className, filled }: Props) {
  const glyph = isIconName(name) ? name : "star";
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-outlined shrink-0", filled && "icon-fill", className)}
      style={{ fontSize: size, width: size, height: size }}
    >
      {glyph}
    </span>
  );
}
