import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Us — Independent AI Tool Reviews for UK SMEs",
  description: "SmarterBiz.uk publishes independent reviews, comparisons and guides to AI tools for UK small businesses, with sterling pricing, UK GDPR notes and Making Tax Digital checks.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <StaticPage title="About SmarterBiz.uk" path="/about" lead="Practical, independent intelligence on the AI tools that help UK small businesses save time and money.">
      <h2>Why we exist</h2>
      <p>
        Most AI tool reviews are written for US audiences, quote prices in dollars and ignore UK rules. British founders, sole traders and
        SME directors need to know what a tool really costs in pounds, whether it works with HMRC&apos;s Making Tax Digital, how it handles
        UK GDPR and whether it writes proper British English. That&apos;s what we cover.
      </p>
      <h2>Who we are</h2>
      <p>{SITE.author.bio}</p>
      <h2>Our principles</h2>
      <ul>
        <li><strong>Independence:</strong> vendors cannot pay for inclusion or rankings.</li>
        <li><strong>Transparency:</strong> we explain <Link href="/methodology">how we test</Link> and <Link href="/affiliate-disclosure">how we make money</Link>.</li>
        <li><strong>Accuracy:</strong> we update guides regularly and correct mistakes quickly — <Link href="/contact">report one here</Link>.</li>
        <li><strong>Practicality:</strong> we focus on what saves a small business real time.</li>
      </ul>
      <h2>Contact</h2>
      <p>Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or use our <Link href="/contact">contact form</Link>. Tool makers can <Link href="/submit-tool">submit a tool for review</Link>.</p>
    </StaticPage>
  );
}
