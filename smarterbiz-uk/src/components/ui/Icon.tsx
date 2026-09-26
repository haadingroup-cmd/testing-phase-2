import {
  BadgeCheck, Clapperboard, Handshake, Headset, Megaphone, Mic, PenLine, Presentation, Receipt, Rocket, Scale,
  ScanSearch, SearchCheck, ShieldAlert, ShieldCheck, Sparkles, Store, Trophy, Workflow, Zap, type LucideProps,
} from "lucide-react";

const ICONS = {
  BadgeCheck, Clapperboard, Handshake, Headset, Megaphone, Mic, PenLine, Presentation, Receipt, Rocket, Scale,
  ScanSearch, SearchCheck, ShieldAlert, ShieldCheck, Sparkles, Store, Trophy, Workflow, Zap,
} as const;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = ICONS[name as keyof typeof ICONS] ?? Sparkles;
  return <C aria-hidden="true" {...props} />;
}
