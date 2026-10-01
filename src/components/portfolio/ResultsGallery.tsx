"use client";
import { useState } from "react";
import Image from "next/image";
import { RESULTS, type ResultItem, type ResultChannel } from "@/data/portfolio";

/**
 * "Real Results" proof gallery, grouped by channel (SEO / Google Ads /
 * Meta Ads / TikTok Ads / eCommerce). Only channels that actually have
 * screenshots are shown, so this grows as curated proof images are added to
 * data/portfolio.ts. Renders nothing until at least one result exists.
 */
const CHANNELS = ["SEO", "Google Ads", "Meta Ads", "TikTok Ads", "eCommerce"] as const;
type Channel = ResultChannel;

export default function ResultsGallery() {
  const active = CHANNELS.filter((c) => RESULTS[c] && RESULTS[c].length > 0);
  const [tab, setTab] = useState<Channel>(active[0] ?? "Google Ads");

  if (active.length === 0) return null; // no proof images yet

  const items: ResultItem[] = RESULTS[tab] ?? [];

  return (
    <section className="section-pad bg-[#020205]" id="results">
      <div className="container">
        <div className="text-center mb-10">
          <div className="label mb-3">Real Results</div>
          <h2 className="font-display font-black text-white mb-3">
            Proof, Not <span className="gradient-text">Promises</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A snapshot of real campaign and SEO results we&apos;ve driven for clients across markets.
          </p>
        </div>

        {/* Channel tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {active.map((c) => (
            <button
              key={c}
              onClick={() => setTab(c)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                tab === c
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white/5 text-slate-300 border-white/10 hover:border-red-500/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {items.map((r, i) => (
            <figure key={i} className="card overflow-hidden">
              <div className="relative bg-white">
                <Image
                  src={r.src}
                  alt={r.caption}
                  width={800}
                  height={400}
                  className="w-full h-auto"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <figcaption className="px-4 py-3 text-slate-300 text-sm border-t border-white/8">
                {r.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="text-center text-slate-500 text-xs mt-8 max-w-2xl mx-auto">
          Results shown are from real client accounts. Individual results vary by budget, industry and market conditions.
        </p>
      </div>
    </section>
  );
}
