import Link from "next/link";

export function AffiliateDisclosure() {
  return (
    <aside className="border border-l-[3px] border-rule border-l-slate-mute bg-surface px-4 py-3 text-caption text-slate-body">
      <strong className="font-semibold text-ink">Editorial independence:</strong> We test tools independently and no vendor can pay for a
      ranking. Some links may earn us a commission at no extra cost to you, which never affects our scores.{" "}
      <Link href="/affiliate-disclosure" className="underline hover:text-ink">How we make money</Link>.
    </aside>
  );
}

export function HouseAd() {
  return (
    <aside className="flex min-h-[90px] flex-col items-center justify-center rounded-lg border border-dashed border-rule-strong bg-surface px-4 py-3 text-center">
      <span className="text-[10px] uppercase tracking-[0.05em] text-slate-mute">Sponsored listing space</span>
      <p className="mt-1 text-label text-ink">Built an AI tool for UK businesses?</p>
      <Link href="/submit-tool" className="mt-0.5 text-caption font-semibold text-brand hover:underline">
        Submit it for independent review →
      </Link>
    </aside>
  );
}
