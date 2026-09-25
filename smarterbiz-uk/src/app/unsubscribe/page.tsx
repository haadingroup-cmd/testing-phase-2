import { Suspense } from "react";
import { UnsubscribeForm } from "@/components/forms/UnsubscribeForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Unsubscribe",
  description: "Unsubscribe from the SmarterBiz.uk newsletter.",
  path: "/unsubscribe",
  noindex: true,
});

export default function UnsubscribePage() {
  return (
    <div className="container-read py-12">
      <h1 className="font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Unsubscribe</h1>
      <div className="mt-6">
        <Suspense fallback={<div className="card h-32 animate-pulse" />}>
          <UnsubscribeForm />
        </Suspense>
      </div>
    </div>
  );
}
