"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-margin-mobile py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-error-container text-error">
        <Icon name="error" size={28} />
      </span>
      <h1 className="mt-space-md font-headline-md text-headline-md font-bold">Something went wrong</h1>
      <p className="mt-space-sm text-on-surface-variant">An unexpected error occurred. Please try again — if it keeps happening, contact us on WhatsApp.</p>
      {error.digest ? <p className="mt-2 font-body-sm text-body-sm text-outline">Reference: {error.digest}</p> : null}
      <div className="mt-space-lg flex gap-space-sm">
        <button type="button" onClick={reset} className="rounded-xl bg-secondary px-space-lg py-3 font-label-lg text-label-lg text-on-secondary hover:bg-primary-container">
          Try again
        </button>
        <Link href="/" className="rounded-xl bg-surface-container-lowest px-space-lg py-3 font-label-lg text-label-lg shadow-sm hover:bg-surface-container">
          Go home
        </Link>
      </div>
    </div>
  );
}
