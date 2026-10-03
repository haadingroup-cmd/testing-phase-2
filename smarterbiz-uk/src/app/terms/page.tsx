import { StaticPage } from "@/components/content/StaticPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "Terms of use for SmarterBiz.uk.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <StaticPage title="Terms of use" path="/terms" updated="24 September 2026">
      <h2>Information only</h2>
      <p>
        Content on this site is general information, not legal, tax or financial advice. Always check current terms and pricing with vendors,
        and take professional advice on tax, legal and data-protection matters.
      </p>
      <h2>Accuracy</h2>
      <p>We work hard to keep content accurate and up to date, but AI tools and prices change frequently. Scores are editorial opinions.</p>
      <h2>Third-party sites</h2>
      <p>We link to third-party websites. We are not responsible for their content, products or privacy practices.</p>
      <h2>Intellectual property</h2>
      <p>Our content is protected by copyright. You may quote short extracts with a link back. Product names and trademarks belong to their owners.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of England and Wales.</p>
    </StaticPage>
  );
}
