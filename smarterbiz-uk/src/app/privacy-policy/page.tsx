import { StaticPage } from "@/components/content/StaticPage";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy (UK GDPR)",
  description: "How SmarterBiz.uk collects, uses and protects personal data under UK GDPR and the Data Protection Act 2018.",
  path: "/privacy-policy",
});

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy policy" path="/privacy-policy" updated="24 September 2026">
      <p>
        This policy explains how {SITE.legalName || SITE.name} (&quot;we&quot;) handles personal data under the UK General Data Protection
        Regulation (UK GDPR) and the Data Protection Act 2018.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Newsletter:</strong> your email address and the page you subscribed from.</li>
        <li><strong>Contact form:</strong> your name, email address and message.</li>
        <li><strong>Tool submissions:</strong> your name, work email and details of the tool.</li>
        <li><strong>Technical data:</strong> our hosting provider processes IP addresses in server logs for security and abuse prevention.</li>
      </ul>
      <p>This website does not use advertising or analytics cookies. If that changes, we will ask for your consent first.</p>
      <h2>Why we use it (lawful basis)</h2>
      <ul>
        <li>Newsletter — <strong>consent</strong>, which you can withdraw at any time using the unsubscribe link in every email (one-click unsubscribe is supported).</li>
        <li>Contact and submissions — <strong>legitimate interests</strong> in responding to your enquiry.</li>
        <li>Security logs — <strong>legitimate interests</strong> in keeping the site secure.</li>
      </ul>
      <h2>Who we share it with</h2>
      <p>
        We use trusted processors to run this site, including our hosting provider, database provider and email delivery provider. They process data only on our
        instructions under data processing agreements. Where data is transferred outside the UK, appropriate safeguards are used.
      </p>
      <h2>How long we keep it</h2>
      <p>Newsletter data until you unsubscribe; enquiries for up to 24 months; submissions for up to 36 months.</p>
      <h2>Your rights</h2>
      <p>
        You have rights to access, correct, erase, restrict and object to processing of your data, and to data portability. Email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. You can also complain to the Information Commissioner&apos;s Office at{" "}
        <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.
      </p>
    </StaticPage>
  );
}
