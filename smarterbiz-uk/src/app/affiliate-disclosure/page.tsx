import { StaticPage } from "@/components/content/StaticPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Affiliate Disclosure",
  description: "How SmarterBiz.uk makes money, and how we keep our reviews and rankings independent.",
  path: "/affiliate-disclosure",
});

export default function AffiliatePage() {
  return (
    <StaticPage title="Affiliate disclosure" path="/affiliate-disclosure" updated="24 September 2026">
      <p>
        SmarterBiz.uk is free to read. To fund our work, some links to software vendors may be affiliate links: if you click and buy, we may
        earn a commission at no extra cost to you.
      </p>
      <h2>What this means for our reviews</h2>
      <ul>
        <li>Commissions never affect which tools we include or how we score them.</li>
        <li>Vendors cannot pay for rankings, reviews or placement.</li>
        <li>We recommend free tools and free plans whenever they are the best option.</li>
        <li>Affiliate links are marked with <code>rel=&quot;sponsored&quot;</code> in line with search-engine guidelines.</li>
      </ul>
      <p>This disclosure is provided in line with the UK Advertising Standards Authority (ASA) and CAP Code expectations on transparency.</p>
    </StaticPage>
  );
}
