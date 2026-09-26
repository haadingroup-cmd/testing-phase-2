"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error.digest ?? "client error");
  }, [error]);
  return (
    <div className="container-read py-20 text-center">
      <p className="kicker">Something went wrong</p>
      <h1 className="mt-2 font-serif text-headline-xl-mobile text-ink">Sorry — this page hit a snag</h1>
      <p className="mt-3 text-body-lg text-slate-body">Please try again. If it keeps happening, let us know.</p>
      <div className="mt-6 flex justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">Try again</button>
        <Link href="/" className="btn-secondary">Go home</Link>
      </div>
    </div>
  );
}
