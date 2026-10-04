export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="8" fill="#0F172A" />
      <path d="M12 20L20 12L28 20L20 28Z" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="3" fill="#FFFFFF" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className={compact ? "h-7 w-7" : "h-9 w-9"} />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[21px] font-semibold tracking-tight text-ink">
          SmarterBiz<span className="text-brand">.uk</span>
        </span>
        {!compact && <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-mute">UK AI &amp; Software Guide</span>}
      </span>
    </span>
  );
}
