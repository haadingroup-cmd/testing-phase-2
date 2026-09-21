import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  FileText,
  Globe,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import Analyzer, { AnalyzerHeader } from "@/components/seo/Analyzer";
import { brand, categoryLabels, disclaimer } from "@/lib/seo/config";
import { aiConfigured } from "@/lib/seo/ai";
import { methodologyWeights } from "@/lib/seo/scoring";
import { categories } from "@/lib/seo/types";
import "./seo-analyzer.css";
export const dynamic = "force-dynamic";
const canonical = `${brand.website}/free-seo-audit`;
const title = "Free SEO Analyzer | Website SEO Audit Tool | HaadinGlobal";
const description =
  "Analyze your website SEO for free with HaadinGlobal's SEO Analyzer. Find technical, on-page, content, local and social SEO issues and get actionable recommendations.";
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical },
  openGraph: { title, description, url: canonical, type: "website" },
  twitter: { card: "summary", title, description },
  robots: { index: true, follow: true },
};
const faqs = [
  [
    "What is an SEO audit?",
    "An SEO audit reviews how a website can be accessed, understood and used. This tool checks publicly available HTML and returns observed issues with evidence and suggested fixes. A complete SEO strategy also needs business context, search data and human review.",
  ],
  [
    "Is this SEO analyzer free?",
    "Yes. The available basic audit, limited page crawl, findings and PDF report are free. No credit card or contact form is required. Fair-use limits protect the service. Optional AI and PageSpeed features are available only when their providers are configured.",
  ],
  [
    "Does this tool guarantee Google rankings?",
    "No. The score is HaadinGlobal’s diagnostic indicator for the checks this tool can perform. It is not an official Google score, a ranking forecast or a guarantee of traffic.",
  ],
  [
    "Can I analyze any website?",
    "You can submit a public HTTP or HTTPS webpage. Private networks, login-only pages, unsupported files and sites that restrict this crawler cannot be analyzed. Respect the site owner’s rules when requesting an audit.",
  ],
  [
    "Does the tool check technical SEO?",
    "It checks response status, redirects, indexing directives, canonical tags, robots access, sitemap discovery, selected mobile declarations, JSON-LD syntax and other observable HTML signals. It does not execute page JavaScript or confirm Google index status.",
  ],
  [
    "Can I download a PDF report?",
    "Yes. After an audit completes, download a branded PDF with your scores, findings, sources, limitations and action plan. CSV and JSON exports are also available. Reports are session-based, so export yours before refreshing or leaving.",
  ],
  [
    "Can I check local SEO?",
    "Add your real business details and target location. The tool reviews on-site contact links, business schema and location references. It does not verify Google Business Profile eligibility, local pack rankings or external directory consistency.",
  ],
  [
    "Can I check social media SEO?",
    "The tool reviews website sharing tags and links to recognized social platforms. You can supply official profile URLs for reference checks. Restricted profile content, follower counts and engagement are not scraped or invented.",
  ],
  [
    "Does this tool replace an SEO expert?",
    "No. It helps you identify and prioritize observable issues. An expert can assess the business, intent, rendered experience, competitors and authorized search data before recommending larger changes.",
  ],
  [
    "What data does the tool use?",
    "The basic report uses publicly accessible server-returned website HTML and response headers. If enabled and requested, AI suggestions send bounded page excerpts and the context you enter to OpenAI. A separate PageSpeed test sends the public URL to Google. API keys stay on the server.",
  ],
];
export default function SEOAuditPage() {
  const weights = methodologyWeights();
  const total = weights.reduce((a, b) => a + b, 0);
  const structured = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "HaadinGlobal SEO Analyzer",
    url: canonical,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web browser",
    description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: {
      "@type": "Organization",
      name: brand.agency,
      url: brand.website,
    },
  };
  return (
    <div className="hg-seo" lang="en" dir="ltr">
      <a className="hg-skip-link" href="#main">
        Skip to content
      </a>
      <AnalyzerHeader />
      <main id="main">
        <Analyzer
          features={{
            ai: aiConfigured(),
            pagespeed: Boolean(process.env.PAGESPEED_API_KEY),
          }}
        />
        <section className="hg-wrap hg-section" id="how-it-works">
          <div className="hg-section-title">
            <div>
              <span className="hg-eyebrow">FROM A URL TO A PLAN</span>
              <h2>
                Less guesswork.
                <br />
                More useful next steps.
              </h2>
            </div>
            <p className="hg-section-intro">
              You don’t need to speak SEO.
              <br />
              We connect each finding to what it means
              <br />
              and what you can do about it.
            </p>
          </div>
          <div className="hg-steps">
            {[
              [
                Search,
                "01",
                "Analyze your website",
                "We retrieve public pages, respect crawl restrictions and check the signals we can observe.",
              ],
              [
                Target,
                "02",
                "Understand the findings",
                "See a clearly scoped check score, actual evidence and plain-language explanations of what needs attention.",
              ],
              [
                CheckCircle2,
                "03",
                "Make meaningful improvements",
                "Follow your priority action plan, review suggestions and take a professional PDF with you.",
              ],
            ].map(([Icon, n, heading, copy]) => {
              const I = Icon as typeof Search;
              return (
                <article className="hg-step" key={String(n)}>
                  <div className="hg-step-top">
                    <I size={25} />
                    <span>{String(n)}</span>
                  </div>
                  <h3>{String(heading)}</h3>
                  <p>{String(copy)}</p>
                </article>
              );
            })}
          </div>
        </section>
        <section className="hg-feature-section">
          <div className="hg-wrap">
            <div className="hg-section-title">
              <div>
                <span className="hg-eyebrow">A MORE COMPLETE PICTURE</span>
                <h2>The details that deserve a closer look.</h2>
              </div>
            </div>
            <div className="hg-feature-grid">
              {[
                [
                  Code2,
                  "Technical foundations",
                  "Check response codes, canonical URLs, indexing directives, robots access and structured data syntax.",
                ],
                [
                  FileText,
                  "On-page clarity",
                  "Review titles, descriptions, headings, image alternatives and internal navigation in the sampled HTML.",
                ],
                [
                  Target,
                  "Content structure",
                  "Understand the text and headings available to crawlers. Request a separate AI topic assessment when configured.",
                ],
                [
                  MapPin,
                  "Local business signals",
                  "Look for factual business, contact and location information. Build around places your business genuinely serves.",
                ],
                [
                  Globe,
                  "Social & sharing",
                  "Inspect link-preview metadata and website references to your social profiles, without invented audience metrics.",
                ],
                [
                  Sparkles,
                  "Suggestions you can review",
                  "AI, when configured, works from observed page content. Templates and measured findings remain clearly labeled.",
                ],
              ].map(([Icon, heading, copy]) => {
                const I = Icon as typeof Search;
                return (
                  <article key={String(heading)}>
                    <div className="hg-feature-icon">
                      <I size={23} />
                    </div>
                    <h3>{String(heading)}</h3>
                    <p>{String(copy)}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        <section className="hg-wrap hg-section hg-methodology" id="methodology">
          <div>
            <span className="hg-eyebrow">TRANSPARENCY IS THE POINT</span>
            <h2>
              How we calculate
              <br />
              your score.
            </h2>
            <p>
              Each category measures the weighted share of checks that pass.
              Unavailable checks are excluded. The overall score combines the
              available categories using the weights shown here.
            </p>
            <p>
              These weights are our audit methodology and are not Google’s
              ranking formula. A small, accessible sample is useful evidence—not
              a complete view of your website.
            </p>
            <a href="#analyze" className="hg-text-link">
              Start with your website <ArrowRight size={16} />
            </a>
          </div>
          <div className="hg-method-card">
            {categories.map((category, i) => (
              <div key={category}>
                <span>{categoryLabels[category]}</span>
                <div className="hg-bar">
                  <i style={{ width: `${(weights[i] / total) * 100}%` }} />
                </div>
                <strong>{Math.round((weights[i] / total) * 100)}%</strong>
              </div>
            ))}
            <p>
              90–100 Most checked signals pass · 75–89 Some checks need attention
              <br />
              50–74 Several checks need attention · 0–49 Many checks need attention
            </p>
            <p className="hg-note">
              Labels describe the checked HTML signals only. Content, performance, local and
              social categories cover the limited signals explained in each
              report.
            </p>
          </div>
        </section>
        <section className="hg-wrap hg-trust-note">
          <ShieldCheck size={25} />
          <div>
            <h3>No invented metrics. No ranking promises.</h3>
            <p>
              Traffic, backlinks, keyword volume and ranking positions require
              legitimate data sources. When we don’t have the data, we say so.
            </p>
          </div>
        </section>
        <section className="hg-wrap hg-section hg-faq" id="faq">
          <div>
            <span className="hg-eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</span>
            <h2>
              Before you
              <br />
              dive in.
            </h2>
            <p>
              Understand what this audit can tell you, and where a deeper review
              helps.
            </p>
          </div>
          <div>
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="hg-wrap hg-related">
          <span className="hg-eyebrow">HELP WHEN YOU NEED IT</span>
          <h2>Go from understanding to improving.</h2>
          <div>
            <a href={brand.seo}>
              SEO & local SEO <ArrowUpRight size={17} />
            </a>
            <a href={`${brand.website}/services/web-development`}>
              Website development <ArrowUpRight size={17} />
            </a>
            <a href={`${brand.website}/services/social-media`}>
              Social media management <ArrowUpRight size={17} />
            </a>
            <a href={`${brand.website}/services`}>
              Digital marketing <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
      </main>
      <footer className="hg-footer">
        <div className="hg-wrap">
          <div className="hg-footer-top">
            <a href={brand.website} className="hg-brand">
              <span className="hg-brand-symbol">
                H<span>G</span>
              </span>
              <span>
                Haadin<span className="hg-brand-gold">Global</span>
                <small>ANALYZE. UNDERSTAND. IMPROVE.</small>
              </span>
            </a>
            <div>
              <a href={brand.contact}>
                Contact us <ArrowUpRight size={13} />
              </a>
              <a href={`${brand.website}/privacy-policy`}>Privacy</a>
              <a href={`${brand.website}/terms`}>Terms</a>
            </div>
          </div>
          <p>{disclaimer}</p>
          <div className="hg-footer-bottom">
            <span>
              © {new Date().getFullYear()} {brand.agency}
            </span>
            <span>Built for useful, honest answers.</span>
          </div>
        </div>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
