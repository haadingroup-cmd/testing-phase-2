"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";

interface Result { type: string; title: string; description: string; href: string }

export function SearchClient() {
  const params = useSearchParams();
  const router = useRouter();
  const q = (params.get("q") ?? "").slice(0, 80);
  const [value, setValue] = useState(q);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setValue(q), [q]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    setError("");
    fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
      .then((r) => r.json() as Promise<{ ok: boolean; results?: Result[]; error?: string }>)
      .then((d) => {
        if (d.ok) setResults(d.results ?? []);
        else setError(d.error ?? "Search failed.");
      })
      .catch((e: unknown) => {
        if ((e as Error).name !== "AbortError") setError("Search is unavailable right now.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [q]);

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const v = value.trim().slice(0, 80);
          router.push(v ? `/search?q=${encodeURIComponent(v)}` : "/search");
        }}
        className="flex gap-2"
      >
        <label htmlFor="search-page" className="sr-only">Search</label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-mute" aria-hidden="true" />
          <input id="search-page" type="search" value={value} maxLength={80} onChange={(e) => setValue(e.target.value)} placeholder="Try ‘accounting’, ‘Claude’ or ‘GDPR’" className="input pl-9" autoFocus />
        </div>
        <button type="submit" className="btn-dark">Search</button>
      </form>

      <div className="mt-6" aria-live="polite">
        {loading && <p className="flex items-center gap-2 text-body-md text-slate-body"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Searching…</p>}
        {error && <p role="alert" className="text-body-md text-red-700">{error}</p>}
        {!loading && q && !error && (
          <p className="text-body-sm text-slate-mute">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>
        )}
        <ul className="mt-3 flex flex-col gap-3">
          {results.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="card block p-4 hover:border-rule-strong hover:shadow-pop">
                <span className="text-caption uppercase tracking-wider text-brand">{r.type}</span>
                <span className="mt-1 block text-headline-sm text-ink">{r.title}</span>
                <span className="mt-1 line-clamp-2 block text-body-md text-slate-body">{r.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        {!loading && q && !error && results.length === 0 && (
          <p className="card mt-3 p-6 text-body-md text-slate-body">
            No matches. Browse the <Link href="/tools" className="text-brand underline">tools directory</Link> or <Link href="/guides" className="text-brand underline">guides</Link>.
          </p>
        )}
      </div>
    </div>
  );
}
